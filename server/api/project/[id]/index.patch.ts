import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import StatusCodes from 'http-status-codes';
import { z } from 'zod';
import * as pdb from '~/server/data/projects';
import * as sdb from '~/server/data/sheets';

const paramsSchema = z.object({
	id: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

	const user = await ensureLoggedIn(event);

	let project = await pdb.findById(id);
	if (!project) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	await ensureAdminOr(event, project.userId);

	const changes = await readBody<any>(event);

	delete changes.id;
	delete changes.views;
	if (!user.isAdmin) delete changes.userId;

	if (changes.image === null || changes.image === '') {
		deleteImageFile(project.image);
	} else {
		delete changes.image;
	}

	delete changes.password;
	if (changes.newPassword !== undefined) {
		changes.password = changes.newPassword ? bcrypt.hashSync(changes.newPassword, 10) : null;
	}

	if (changes.slug === null || changes.slug === '') {
		// request removes custom slug, generate based on title
		changes.slug = await generateValidSlug(changes.title || project.title, project.id);
	} else if (changes.slug) {
		// request modifies slug, just validate
		changes.slug = await generateValidSlug(changes.slug, project.id);
	}

	if (!['N', 'E', 'D'].includes(changes.subscribe)) {
		changes.subscribe = 'N';
	}
	if (changes.subscribe !== 'N' && changes.subscribe !== project.subscribe) {
		// it's been turned on now
		changes.unsubscribeToken = crypto.randomBytes(64).toString('hex');
		changes.lastSent = Date.now();
	}

	project = pdb.createProject({ ...project, ...changes });
	if (!project.title) throw createError({ statusCode: StatusCodes.BAD_REQUEST });
	await pdb.update(project);

	project = await pdb.findById(project.id);
	project.sheets = await sdb.findAllByProjectId(project.id);
	return hideSecrets(project);
});
