import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import * as pdb from '~/server/data/projects';
import * as udb from '~/server/data/users';
import { deleteImageFile } from '~/server/utils/uploads';

const bodySchema = z.object({
	id: z.number(),
	password: z.string().min(1),
});

export default defineEventHandler(async (event) => {
	const { id, password } = await readValidatedBody(event, bodySchema.parse);

	await ensureLoggedIn(event);
	await ensureAdminOr(event, id);

	// checking CURRENT user's password (not the selected user's)
	if (!password || !bcrypt.compareSync(password, event.context.user!.password)) {
		throw createError({
			message: 'PASSWORD_INVALID',
			status: StatusCodes.BAD_REQUEST,
		});
	}

	const user = await udb.findById(id);
	if (!user) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	deleteImageFile(user.logo);

	const projects = await pdb.findAllByUserId(id);
	for (const p of projects) {
		deleteImages(String(p.id));
	}
	await udb.del(id); // deletes all records
});
