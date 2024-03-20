import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import * as db from '~/server/data/users';

const bodySchema = z.object({
	token: z.string().min(1),
});

export default defineEventHandler(async (event) => {
	const { token } = await readValidatedBody(event, bodySchema.parse);
	const user = await db.findByToken(token);

	if (!user || (user.tokenExpires || 0) < Date.now()) {
		throw createError({
			message: 'TOKEN_INVALID',
			statusCode: StatusCodes.BAD_REQUEST,
		});
	}

	user.active = true;
	user.token = null;
	user.tokenExpires = null;
	await db.update(user);
});
