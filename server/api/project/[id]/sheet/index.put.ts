import StatusCodes from 'http-status-codes';
import { z } from 'zod';
import * as pdb from '~/server/data/projects';
import * as sdb from '~/server/data/sheets';

const paramsSchema = z.object({
	id: z.coerce.number(),
});

const bodySchema = z.object({
	image: z.string().optional(),
	title: z.string().min(1),
});

export default defineEventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, paramsSchema.parse);
	const body = await readValidatedBody(event, bodySchema.parse);

	await ensureLoggedIn(event);

	const project = await pdb.findById(id);
	if (!project) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	await ensureAdminOr(event, project.userId);

	delete body.image;
	const newSheetData = { ...body, projectId: id };
	const newSheetId = await sdb.create(newSheetData);
	if (!newSheetId) throw createError({ statusCode: StatusCodes.METHOD_FAILURE });

	const sheet = await sdb.findById(newSheetId);
	return sheet;
});
