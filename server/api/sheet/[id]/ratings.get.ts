import StatusCodes from 'http-status-codes';
import { z } from 'zod';
import * as pdb from '~/server/data/projects';
import * as rdb from '~/server/data/ratings';
import * as sdb from '~/server/data/sheets';

const paramsSchema = z.object({
	id: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

	await ensureLoggedIn(event);

	const sheet = await sdb.findById(id);
	if (!sheet) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	const project = await pdb.findById(sheet.projectId);
	if (!project) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	await ensureAdminOr(event, project.userId);

	const dict = await rdb.aggregateBySheetIdToDict(sheet.id);
	return dict;
});
