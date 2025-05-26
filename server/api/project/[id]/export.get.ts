import StatusCodes from 'http-status-codes';
import { z } from 'zod';
import * as pdb from '~/server/data/projects';
import * as sdb from '~/server/data/sheets';

const paramsSchema = z.object({
	id: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

	await ensureLoggedIn(event);

	const project: pdb.Project = await pdb.findById(id);
	if (!project) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	await ensureAdminOr(event, project.userId);

	const sheets: Partial<sdb.Sheet>[] = await sdb.findAllByProjectId(project.id);
	for (const s of sheets) {
		delete s.id;
		delete s.image;
		delete s.projectId;
	}

	const p: Partial<pdb.Project> = project;
	delete p.id;
	delete p.image;
	delete p.lastSent;
	delete p.sheets;
	delete p.subscribe;
	delete p.unsubscribeToken;
	delete p.userId;
	delete p.views;
	return { ...p, sheets };
});
