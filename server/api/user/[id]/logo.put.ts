import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import * as db from '~/server/data/users';

const paramsSchema = z.object({
	id: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

	await ensureLoggedIn(event);
	await ensureAdminOr(event, (context) => context.user?.id === id);

	const user = await db.findById(id);
	if (!user) throw createError({ status: StatusCodes.NOT_FOUND });

	const url = await acceptImage(event, 'u', 120, 30);
	user.logo = url;
	await db.update(user);

	return { url };
});
