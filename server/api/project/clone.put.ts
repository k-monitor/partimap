import StatusCodes from 'http-status-codes';
import { z } from 'zod';
import * as pdb from '~/server/data/projects';
import * as sdb from '~/server/data/sheets';

// TODO refactor to /api/project/:id/clone { title }

const bodySchema = z.object({
	id: z.coerce.number(),
	title: z.string().min(1),
});

export default defineEventHandler(async (event) => {
	const { id: oldId, title } = await readValidatedBody(event, bodySchema.parse);

	await ensureLoggedIn(event);

	let project = await pdb.findById(oldId);
	if (!project) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	await ensureAdminOr(event, project.userId);

	project.slug = await generateValidSlug(title);
	project.title = title;
	project.views = 0;

	const newId = await pdb.create(project);
	if (!newId) throw createError({ statusCode: StatusCodes.METHOD_FAILURE });

	await cloneImages(String(oldId), String(newId));

	// TODO would be nice to store only filenames in db, without directory
	// then we wouldn't need to patch db records

	// TODO below stuff would be nicer in a transaction

	project = await pdb.findById(newId);
	if (project.image) {
		project.image = project.image.replace(`/${oldId}/`, `/${newId}/`);
		await pdb.update(project);
	}

	const sheets = await sdb.findAllByProjectId(oldId);
	for (let i = 0; i < sheets.length; i++) {
		const s = sheets[i];
		s.projectId = newId;
		if (s.image) s.image = s.image.replace(`/${oldId}/`, `/${newId}/`);
		await sdb.create(s);
	}

	return { id: newId };
});
