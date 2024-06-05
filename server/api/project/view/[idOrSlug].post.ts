import StatusCodes from 'http-status-codes';
import { z } from 'zod';
import * as db from '~/server/data/projects';

const paramsSchema = z.object({
	idOrSlug: z.string().min(1),
});

export default defineEventHandler(async (event) => {
	const { idOrSlug } = await getValidatedRouterParams(event, paramsSchema.parse);

	const project = await db.findByIdOrSlug(idOrSlug);
	if (!project) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	const exp = `/p/${idOrSlug}/0`;
	const referer = getHeader(event, 'referer');
	if (!referer?.endsWith(exp)) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST });
	}

	if (event.context.user) {
		const user = event.context.user;
		if (user.isAdmin || user.id === project.userId) {
			// An admin or project owner is viewing the project
			// -> do not increase the view count
			return;
		}
	}

	await db.incrementViewsById(project.id);
});
