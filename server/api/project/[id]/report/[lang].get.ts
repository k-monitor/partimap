import { Readable } from 'stream';
import StatusCodes from 'http-status-codes';
import slugify from 'slugify';
import { z } from 'zod';
import * as pdb from '~/server/data/projects';

const paramsSchema = z.object({
	id: z.coerce.number(),
	lang: z.string(),
});

export default defineEventHandler(async (event) => {
	const { id, lang } = await getValidatedRouterParams(event, paramsSchema.parse);

	await ensureLoggedIn(event);

	const project = await pdb.findById(id);
	if (!project) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	await ensureAdminOr(event, project.userId);

	const wb = await generateReport(project, lang);

	const buffer: Buffer = await wb.writeToBuffer();
	const filename = `${slugify(project.title || 'export')}.xlsx`;
	setHeader(event, 'content-disposition', `attachment; filename=${filename}`);
	await sendStream(event, Readable.from(buffer, {}));
});
