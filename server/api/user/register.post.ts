import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import * as db from '~/server/data/users';
import { env } from '~/env';

const bodySchema = z.object({
	captcha: z.string().min(1).optional(),
	consent: z.boolean().optional(),
	email: z.string().email(),
	name: z.string().min(1),
	password: z
		.string()
		.min(1)
		.default(() => crypto.randomBytes(64).toString('hex')),
	locale: z.string().length(2),
});

export default defineEventHandler(async (event) => {
	const { consent, email, locale, name, password } = await readValidatedBody(
		event,
		bodySchema.parse,
	);

	if (event.context.user) {
		if (!event.context.user.isAdmin) {
			throw createError({ statusCode: StatusCodes.FORBIDDEN });
		}
	} else {
		if (!consent) {
			throw createError({
				message: 'CONSENT_MISSING',
				statusCode: StatusCodes.BAD_REQUEST,
			});
		}
	}

	// Either no user (/register page) or admin (/admin/users).

	const m = i18n(locale).activationEmail;

	if (!event.context.user?.isAdmin) {
		await validateCaptcha(event);
	}

	const hashedPassword = bcrypt.hashSync(password, 10);
	const newUser = db.createUser({
		active: false,
		email,
		name,
		password: hashedPassword,
		registered: Date.now(),
		consent25Aug: Date.now(),
	});
	addToken(newUser);

	const existingUser = await db.findByEmail(email);
	if (!existingUser) {
		await db.create(newUser);
	} else if (!existingUser.active) {
		// user already exists, but inactive, let them re-register
		await db.update({ ...existingUser, ...newUser });
	} else {
		throw createError({
			message: 'EMAIL_ALREADY_EXISTS',
			statusCode: StatusCodes.BAD_REQUEST,
		});
	}

	if (event.context.user?.isAdmin) {
		// admin added a new user
		const user = await db.findByEmail(newUser.email);
		return { id: user.id };
	}

	// self-registered on public page
	const url = `${env.NUXT_PUBLIC_BASE_URL}/${locale}/login?t=${newUser.token}`;
	const body = m.body.replace(/\{user\}/g, name).replace(/\{url\}/g, url);
	await sendEmail(email, m.subject, body);
});
