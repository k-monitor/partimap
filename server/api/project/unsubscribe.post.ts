import StatusCodes from 'http-status-codes';
import { z } from 'zod';
import * as db from '~/server/data/projects';

const bodySchema = z.object({
	id: z.coerce.number(),
	token: z.string().min(1),
});

export default defineEventHandler(async (event) => {
	const { id, token } = await readValidatedBody(event, bodySchema.parse);

	const success = await db.attemptToUnsubscribe(id, token);
	if (!success) throw createError({ statusCode: StatusCodes.BAD_REQUEST });
	return { success };
});
