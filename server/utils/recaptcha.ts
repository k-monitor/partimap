import type { H3Event } from 'h3';
import { StatusCodes } from 'http-status-codes';
import { env } from '~~/env';

export async function validateCaptcha(event: H3Event) {
	const { captcha } = await readBody(event);
	const url = `https://www.google.com/recaptcha/api/siteverify?secret=${env.RECAPTCHA_SECRET_KEY}&response=${captcha}`;
	const res: any = await $fetch(url);
	if (!res.success) {
		throw createError({
			message: 'CAPTCHA_INVALID',
			statusCode: StatusCodes.BAD_REQUEST,
		});
	}
}
