import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { rimrafSync as rmrf } from 'rimraf';
import { z } from 'zod';
import * as pdb from '~/server/data/projects';
import * as udb from '~/server/data/users';

const bodySchema = z.object({
	id: z.number(),
	password: z.string().min(1),
});

export default defineEventHandler(async (event) => {
	const { id, password } = await readValidatedBody(event, bodySchema.parse);

	await ensureLoggedIn(event);
	await ensureAdminOr(event, (context) => context.user?.id === id);

	// checking CURRENT user's password (not the selected user's)
	if (!password || !bcrypt.compareSync(password, event.context.user!.password)) {
		throw createError({
			message: 'PASSWORD_INVALID',
			status: StatusCodes.BAD_REQUEST,
		});
	}

	const user = await udb.findById(id);
	removeUserLogoFile(user);

	const projects = await pdb.findByUserId(id);
	for (const p of projects) {
		rmrf(`./uploads/${p.id}`);
	}
	await udb.del(id); // deletes all records
});
