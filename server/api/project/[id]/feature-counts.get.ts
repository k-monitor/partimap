import StatusCodes from 'http-status-codes';
import { z } from 'zod';
import * as pdb from '~/server/data/projects';
import * as sfdb from '~/server/data/submittedFeatures';

const paramsSchema = z.object({
	id: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

	await ensureLoggedIn(event);

	const project = await pdb.findById(id);
	if (!project) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	await ensureAdminOr(event, project.userId);

	const sfs = await sfdb.findAllByProjectId(project.id);
	const sfcs: Record<number, number> = {};
	sfs.forEach(({ sheetId, features }) => {
		// Repair is needed because there were some truncated JSONs in the DB.
		const f = safeParseJSONArray(features).filter((f) => !!f.id);
		sfcs[sheetId] = (sfcs[sheetId] || 0) + f.length;
	});
	return sfcs;
});
