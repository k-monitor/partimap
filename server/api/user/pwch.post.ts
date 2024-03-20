import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import * as db from '~/server/data/users';

const bodySchema = z.object({
	captcha: z.string().min(1),
	password: z.string().min(1),
	token: z.string().min(1),
});

export default defineEventHandler(async (event) => {
	const { password, token } = await readValidatedBody(event, bodySchema.parse);

	await validateCaptcha(event);

	const user = await db.findByToken(token);
	if (!user || (user.tokenExpires || 0) < new Date().getTime()) {
		throw createError({
			message: 'TOKEN_INVALID',
			statusCode: StatusCodes.BAD_REQUEST,
		});
	}
	if (!password) {
		throw createError({
			message: 'PASSWORD_MISSING',
			statusCode: StatusCodes.BAD_REQUEST,
		});
	}

	user.password = bcrypt.hashSync(password, 10);
	user.token = null;
	user.tokenExpires = null;
	await db.update(user);
});
