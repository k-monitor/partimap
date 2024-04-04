import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import * as pdb from '~/server/data/projects';
import * as sdb from '~/server/data/sheets';

const paramsSchema = z.object({
	id: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

	await ensureLoggedIn(event);

	let sheet = await sdb.findById(id);
	if (!sheet) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	const project = await pdb.findById(sheet.projectId);
	if (!project) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	await ensureAdminOr(event, project.userId);

	const url = await acceptImage(event, String(project.id), 120, 30);
	deleteImageFile(sheet.image);
	sheet.image = url;
	await sdb.update(sheet);
	sheet = await sdb.findById(sheet.id);
	return sheet;
});
