import StatusCodes from 'http-status-codes';
import { z } from 'zod';
import * as db from '~/server/data/maps';

const paramsSchema = z.object({
	id: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

	await ensureLoggedIn(event);

	let map = await db.findById(id);
	if (!map) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	await ensureAdminOr(event, map.userId);

	const changes = await readBody<any>(event);
	delete changes.id;

	if (!event.context.user?.isAdmin) {
		delete changes.userId;
	}

	map = db.createMap({ ...map, ...changes });
	if (!map.title) {
		// TODO would be nice to use validated body instead
		throw createError({ statusCode: StatusCodes.BAD_REQUEST });
	}

	await db.update(map);

	map = await db.findById(map.id);
	return map;
});
