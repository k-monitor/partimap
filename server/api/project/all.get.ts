import { z } from 'zod';
import * as db from '~/server/data/projects';

const querySchema = z.object({
	onlyOwn: z.coerce.boolean().optional(),
});

export default defineEventHandler(async (event) => {
	const { onlyOwn } = await getValidatedQuery(event, querySchema.parse);

	const user = await ensureLoggedIn(event);
	const projects =
		user.isAdmin && !onlyOwn ? await db.findAll() : await db.findAllByUserId(user!.id);
	return projects.map(hideSecrets);
});
