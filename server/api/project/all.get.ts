import { z } from 'zod';
import * as db from '~/server/data/projects';

const PAGE_SIZE = 10;

const querySchema = z.object({
	onlyOwn: z.coerce.boolean().optional(),
	filter: z.string().optional(),
	page: z.coerce.number().optional(),
	filterOwn: z
		.string()
		.optional()
		.transform((v) => v === 'true'),
	lang: z.string().optional(),
});

export default defineEventHandler(async (event) => {
	const {
		onlyOwn,
		filter = '',
		page,
		filterOwn,
		lang,
	} = await getValidatedQuery(event, querySchema.parse);

	const user = await ensureLoggedIn(event);

	if (page !== undefined) {
		const pageNum = Math.max(1, page || 1);
		const userId = !user.isAdmin || filterOwn ? user.id : undefined;
		const langFilter = lang || undefined;
		const [projects, total] = await Promise.all([
			db.findFiltered(filter, userId, langFilter, pageNum, PAGE_SIZE),
			db.countFiltered(filter, userId, langFilter),
		]);
		return { projects: projects.map(hideSecrets), total, pageSize: PAGE_SIZE };
	}

	// Legacy: used by FeatureImportModal and others
	const projects =
		user.isAdmin && !onlyOwn ? await db.findAll() : await db.findAllByUserId(user!.id);
	return projects.map(hideSecrets);
});
