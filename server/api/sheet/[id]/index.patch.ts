import StatusCodes from 'http-status-codes';
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

	const changes = await readBody<any>(event);
	delete changes.id;
	delete changes.projectId;

	if (changes.image === null || changes.image === '') {
		deleteImageFile(sheet.image);
	} else {
		delete changes.image;
	}

	sheet = sdb.createSheet({ ...sheet, ...changes });
	if (!sheet.title) {
		// TODO would be nice to use validated body instead
		throw createError({ statusCode: StatusCodes.BAD_REQUEST });
	}
	await sdb.update(sheet);

	sheet = await sdb.findById(sheet.id);
	return sheet;
});
