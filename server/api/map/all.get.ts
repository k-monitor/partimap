import { parseQuery } from 'vue-router';
import { z } from 'zod';
import * as db from '~/server/data/maps';

const querySchema = z.object({
	onlyFeatureCounts: z.coerce.boolean().optional(),
});

export default defineEventHandler(async (event) => {
	const { onlyFeatureCounts } = await getValidatedQuery(event, querySchema.parse);

	const user = await ensureLoggedIn(event);
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
