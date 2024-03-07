import type { H3Event } from 'h3';
import { StatusCodes } from 'http-status-codes';
import { env } from '~~/env';

export async function validateCaptcha(event: H3Event) {
	const { token } = await readBody(event);
	const url = `https://www.google.com/recaptcha/api/siteverify?secret=${env.RECAPTCHA_SECRET_KEY}&response=${token}`;
	const res: any = await $fetch(url);
	if (!res.success) {
		throw createError({
			message: 'Invalid captcha response',
			statusCode: StatusCodes.BAD_REQUEST,
		});
	}
}
