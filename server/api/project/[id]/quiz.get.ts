import StatusCodes from 'http-status-codes';
import { z } from 'zod';
import * as pdb from '~/server/data/projects';

const paramsSchema = z.object({
	id: z.coerce.number(),
});

export default defineCachedEventHandler(
	async (event) => {
		const { id } = await getValidatedRouterParams(event, paramsSchema.parse);
		const project = await pdb.findByIdOrSlug(id);
		if (!project) throw createError({ statusCode: StatusCodes.NOT_FOUND });
		return project.quizMode;
	},
	{
		getKey: (event) => event.path, // contains project ID
		maxAge: 2, // seconds
	},
);
