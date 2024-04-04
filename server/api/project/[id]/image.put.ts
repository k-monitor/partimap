import StatusCodes from 'http-status-codes';
import { z } from 'zod';
import * as db from '~/server/data/projects';

const paramsSchema = z.object({
	id: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

	await ensureLoggedIn(event);

	let project = await db.findById(id);
	if (!project) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	await ensureAdminOr(event, project.userId);

	const url = await acceptImage(event, String(project.id), 1200, 1200);
	deleteImageFile(project.image);
	project.image = url;
	await db.update(project);
	project = await db.findById(project.id);
	return hideSecrets(project);
});
