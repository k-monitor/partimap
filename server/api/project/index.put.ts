import bcrypt from 'bcryptjs';
import StatusCodes from 'http-status-codes';
import * as pdb from '~/server/data/projects';
import * as sdb from '~/server/data/sheets';

export default defineEventHandler(async (event) => {
	const user = await ensureLoggedIn(event);

	const body = await readBody<any>(event);
	// TODO validate body
	delete body.image;
	if (!body.userId || !user.isAdmin) {
		body.userId = user.id;
	}

	let project = pdb.createProject(body);
	if (!project.title) throw createError({ statusCode: StatusCodes.BAD_REQUEST });

	if (project.password) {
		project.password = bcrypt.hashSync(project.password, 10);
	}

	project.slug = await generateValidSlug(project.slug || project.title);

	const id = await pdb.create(project);
	if (!id) throw createError({ statusCode: StatusCodes.METHOD_FAILURE });

	project = await pdb.findById(id);

	const title = i18n(project.lang).newProject.newSheetTitle;
	await sdb.create({ projectId: id, title });

	return hideSecrets(project);
});
