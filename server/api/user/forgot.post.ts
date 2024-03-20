import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import * as db from '~/server/data/users';
import { env } from '~/env';

const bodySchema = z.object({
	email: z.string().email(),
	locale: z.string().min(1),
});

export default defineEventHandler(async (event) => {
	await validateCaptcha(event);

	const { email, locale } = await readValidatedBody(event, bodySchema.parse);

	const m = i18n(locale).forgotEmail;

	const user = await db.findByEmail(email);
	if (!user) {
		throw createError({
			message: 'EMAIL_INVALID',
			status: StatusCodes.BAD_REQUEST,
		});
	}

	addToken(user);
	await db.update(user);

	const url = `${env.NUXT_PUBLIC_BASE_URL}/${locale}/pwch?t=${user.token}`;
	const body = m.body.replace(/\{user\}/g, user.name).replace(/\{url\}/g, url);
	await sendEmail(user.email, m.subject, body);
});
