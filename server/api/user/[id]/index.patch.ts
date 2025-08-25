import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import * as db from '~/server/data/users';
import { deleteImageFile } from '~/server/utils/uploads';

const paramsSchema = z.object({
	id: z.coerce.number(),
	email: z.string().email().optional(),
});

export default defineEventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

	await ensureLoggedIn(event);
	await ensureAdminOr(event, id);

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
		deleteImageFile(user.logo);
	} else {
		delete changes.logo;
	}

	if (changes.consent25Aug && !user.consent25Aug) {
		changes.consent25Aug = Date.now();
	}

	user = db.createUser({ ...user, ...changes });
	await db.update(user);

	user = await db.findById(user.id);
	if (!user) throw createError({ status: StatusCodes.NOT_FOUND });
	return hideSecrets(user);
});
