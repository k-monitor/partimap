import { z, zh } from 'h3-zod';
import { StatusCodes } from 'http-status-codes';
import * as pdb from '~/server/data/projects';
import * as udb from '~/server/data/users';

export default defineEventHandler(async (event) => {
	await ensureLoggedIn(event);

	const { id } = await zh.useValidatedParams(event, { id: z.coerce.number() });
	const { email } = await zh.useValidatedBody(event, {
		email: z.string().email(),
	});
	const project = await pdb.findById(id);
	if (!project) throw createError({ statusCode: StatusCodes.NOT_FOUND });
	await ensureAdminOr(event, project.userId);

	const user = await udb.findByEmail(email);
	if (!user) throw createError({ statusCode: StatusCodes.NOT_FOUND });
	if (user.id === project.userId) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST });
	}

	project.userId = user.id;
	await pdb.update(project);
});
