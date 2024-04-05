import StatusCodes from 'http-status-codes';
import { z } from 'zod';
import * as db from '~/server/data/sheets';

const paramsSchema = z.object({
	id: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

	const sheet = await db.findById(id);
	if (!sheet) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	return sheet;
});
