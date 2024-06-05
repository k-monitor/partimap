import StatusCodes from 'http-status-codes';
import { z } from 'zod';
import * as pdb from '~/server/data/projects';
import * as sdb from '~/server/data/sheets';

const paramsSchema = z.object({
	id: z.coerce.number(),
	ord: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
	const { id, ord } = await getValidatedRouterParams(event, paramsSchema.parse);

	const project = await pdb.findById(id);
	if (!project) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	const sheet = await sdb.findByProjectIdAndOrder(id, ord);
	if (!sheet) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	return sheet;
});
