import StatusCodes from 'http-status-codes';
import { z } from 'zod';
import * as db from '~/server/data/projects';

const paramsSchema = z.object({
	id: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

	await ensureLoggedIn(event);

	const project = await db.findById(id);
	if (!project) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	await ensureAdminOr(event, project.userId);

	await db.del(id);
	deleteImages(String(project.id));
});
