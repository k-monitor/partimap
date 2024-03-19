import { z } from 'zod';
import * as db from '../../data/users';
import { StatusCodes } from 'http-status-codes';

const activateBodySchema = z.object({
	token: z.string().min(1),
});

export default defineEventHandler(async (event) => {
	const { token } = await readValidatedBody(event, activateBodySchema.parse);
	const user = await db.findByToken(token);

	if (!user || (user.tokenExpires || 0) < Date.now()) {
		throw createError({
			message: 'Invalid activation token',
			statusCode: StatusCodes.BAD_REQUEST,
		});
	}

	user.active = true;
	user.token = null;
	user.tokenExpires = null;
	await db.update(user);
});
