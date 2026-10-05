import { z } from 'zod';
import * as db from '~/server/data/maps';

const PAGE_SIZE = 10;

const querySchema = z.object({
	onlyFeatureCounts: z.coerce.boolean().optional(),
	filter: z.string().optional(),
	page: z.coerce.number().optional(),
	filterOwn: z
		.string()
		.optional()
		.transform((v) => v === 'true'),
});

export default defineEventHandler(async (event) => {
	const {
		onlyFeatureCounts,
		filter = '',
		page,
		filterOwn,
	} = await getValidatedQuery(event, querySchema.parse);

	const user = await ensureLoggedIn(event);

	if (page !== undefined) {
		const pageNum = Math.max(1, page || 1);
		const userId = !user.isAdmin || filterOwn ? user.id : undefined;
		const [maps, total] = await Promise.all([
			db.findFiltered(filter, userId, pageNum, PAGE_SIZE),
			db.countFiltered(filter, userId),
		]);
		return { maps, total, pageSize: PAGE_SIZE };
	}

	// Legacy: used by onlyFeatureCounts callers
	const maps = user.isAdmin ? await db.findAll() : await db.findAllByUserId(user.id);
	if (onlyFeatureCounts) {
		return maps.map((m) => ({
			...m,
			featureCount: safeParseJSONArray(m.features).length,
			features: '',
		}));
	}
	return maps;
});
