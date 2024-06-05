import StatusCodes from 'http-status-codes';
import { z } from 'zod';
import * as db from '~/server/data/maps';

const paramsSchema = z.object({
	id: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

	await ensureLoggedIn(event);

	const map = await db.findById(id);
	if (!map) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	await ensureAdminOr(event, map.userId);

	await db.del(id);
});
