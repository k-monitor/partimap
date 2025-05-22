import StatusCodes from 'http-status-codes';
import { z } from 'zod';
import * as db from '~/server/data/maps';

// TODO refactor to /api/map/:id/clone { title }

const bodySchema = z.object({
	id: z.number(),
	title: z.string(),
});

export default defineEventHandler(async (event) => {
	await ensureLoggedIn(event);

	const { id, title } = await readValidatedBody(event, bodySchema.parse);

	const map = await db.findById(id);
	if (!map) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	await ensureAdminOr(event, map.userId);

	map.title = title;
	const newId = await db.create(map);
	return { id: newId };
});
