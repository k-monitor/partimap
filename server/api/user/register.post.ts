import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import * as db from '~/server/utils/database';
import type { PDField } from '~/server/data/pdLog';
import * as ldb from '~/server/data/pdLog';
import * as udb from '~/server/data/users';

const bodySchema = z.object({
	address: z.string().min(1),
	birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, expected YYYY-MM-DD'),
	birthPlace: z.string().min(1),
	captcha: z.string().min(1).optional(),
	consent: z.boolean().optional(),
	email: z.string().email(),
	fullName: z.string().min(1),
	locale: z.string().length(2),
	password: z
		.string()
		.min(1)
		.default(() => crypto.randomBytes(64).toString('hex')),
});

export default defineEventHandler(async (event) => {
	const { address, birthDate, birthPlace, consent, email, locale, fullName, password } =
		await readValidatedBody(event, bodySchema.parse);

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
	const newUser = udb.createUser({
		active: false,
		email,
		password: hashedPassword,
		registered: Date.now(),
		consent25Aug: Date.now(),
		name: '',
		eFullName: encryptField(fullName),
		eAddress: encryptField(address),
		eBirthDate: encryptField(birthDate),
		eBirthPlace: encryptField(birthPlace),
	});
	addToken(newUser);

	const existingUser = await udb.findByEmail(email);
	if (!existingUser) {
		await udb.create(newUser);
	} else if (!existingUser.active) {
		// user already exists, but inactive, let them re-register
		await udb.update({ ...existingUser, ...newUser, id: existingUser.id });
	} else {
		throw createError({
			message: 'EMAIL_ALREADY_EXISTS',
			statusCode: StatusCodes.BAD_REQUEST,
		});
	}

	const user = await udb.findByEmail(newUser.email);
	if (event.context.user?.isAdmin) {
		// admin added a new user
		return { id: user.id };
	} else {
		// new user self-registered
		await db.inTransaction(async (tx) => {
			const queries = ldb.PD_FIELDS.map((field) =>
				ldb.createQuery({
					timestamp: newUser.registered,
					actorId: user.id,
					subjectId: user.id,
					field,
					operation: 'first_write',
				}),
			);
			await db.runQueries(tx, queries);
		});
	}

	// self-registered on public page
	const {
		public: { baseUrl },
	} = useRuntimeConfig();
	const url = `${baseUrl}/${locale}/login?t=${newUser.token}`;
	const body = m.body.replace(/\{user\}/g, fullName).replace(/\{url\}/g, url);
	await sendEmail(email, m.subject, body);
});
