import StatusCodes from 'http-status-codes';
import { z } from 'zod';
import * as pdb from '~/server/data/projects';
import * as sdb from '~/server/data/sheets';
import * as sfdb from '~/server/data/submittedFeatures';

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

	const sfs = await sfdb.findAllBySheetId(sheet.id);
	sfs.forEach((sf) => {
		const arr = safeParseJSONArray(sf.features).filter((f) => !!f.id);
		sf.features = JSON.stringify(arr);
	});
	return sfs;
});
