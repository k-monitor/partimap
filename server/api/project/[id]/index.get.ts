import StatusCodes from 'http-status-codes';
import { z } from 'zod';
import * as pdb from '~/server/data/projects';
import * as sdb from '~/server/data/sheets';

const paramsSchema = z.object({
	id: z.string().min(1), // ID or slug!
});

export default defineEventHandler(async (event) => {
	const { id: idOrSlug } = await getValidatedRouterParams(event, paramsSchema.parse);

	await ensureLoggedIn(event);
	// this endpoint is only used in admin, public endpoint is POST /project/access

	const project = await pdb.findByIdOrSlug(idOrSlug);
	if (!project) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	await ensureAdminOr(event, project.userId);

	project.sheets = await sdb.findAllByProjectId(project.id);
	return hideSecrets(project);
});
