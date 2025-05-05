import StatusCodes from 'http-status-codes';
import { zh, z } from 'h3-zod';
import * as pdb from '~/server/data/projects';

const paramsSchema = z.object({
	id: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

	await ensureLoggedIn(event);
	await ensureAdmin(event);

	const project = await pdb.findById(id);
	if (!project) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	const { quizMode } = await zh.useValidatedBody(event, {
		quizMode: z.coerce.number().int().min(0),
	});
	await pdb.updateQuizMode(id, quizMode);
});
