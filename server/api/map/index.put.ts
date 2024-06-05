import { z } from 'zod';
import * as mdb from '~/server/data/maps';
import * as sfdb from '~/server/data/submittedFeatures';

const bodySchema = z.object({
	importSubmittedFeatures: z.number().optional(),
	title: z.string(),
	userId: z.number().optional(),
});

export default defineEventHandler(async (event) => {
	const { importSubmittedFeatures, title, userId } = await readValidatedBody(
		event,
		bodySchema.parse,
	);

	const user = await ensureLoggedIn(event);

	const map = mdb.createMap({
		title,
		userId: user.id,
	});

	if (user.isAdmin && userId) map.userId = userId;

	if (importSubmittedFeatures) {
		const features: any[] = [];
		const sfs = await sfdb.findAllBySheetId(importSubmittedFeatures);
		(sfs || []).forEach((sf) => {
			const f = safeParseJSONArray(sf.features).filter((f) => !!f.id);
			features.push(...f);
		});
		map.features = JSON.stringify(features);
	}

	const id = await mdb.create(map);
	return { id };
});
