import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import * as db from '~/server/data/users';

const paramsSchema = z.object({
	id: z.coerce.number(),
	email: z.string().email().optional(),
});

export default defineEventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

	await ensureLoggedIn(event);
	await ensureAdminOr(event, (context) => context.user?.id === id);

	let user = await db.findById(id);
	if (!user) throw createError({ status: StatusCodes.NOT_FOUND });

	const changes = await readBody<any>(event);
	delete changes.id;
	delete changes.password;
	delete changes.registered;
	delete changes.token;
	delete changes.tokenExpires;

	if (!event.context.user?.isAdmin) {
		delete changes.active;
		delete changes.isAdmin;

		if (changes.newPassword || changes.email !== user.email) {
			if (!changes.oldPassword || !bcrypt.compareSync(changes.oldPassword, user.password)) {
				throw createError({
					message: 'OLDPASSWORD_INVALID',
					status: StatusCodes.FORBIDDEN,
				});
			}
		}
	}

	if (changes.newPassword) {
		changes.password = bcrypt.hashSync(changes.newPassword, 10);
	}

	if (changes.logo === null || changes.logo === '') {
		removeUserLogoFile(user);
	} else {
		delete changes.logo;
	}

	user = db.createUser({ ...user, ...changes });
	await db.update(user);

	user = await db.findById(user.id);
	return hideSecrets(user);
});
