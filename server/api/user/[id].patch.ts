import fs from 'fs';
import bcrypt from 'bcryptjs';
import emailValidator from 'email-validator';
import { z } from 'zod';
import * as db from '../../data/users';
import { User } from '../../data/users';
import { StatusCodes } from 'http-status-codes';

const paramsSchema = z.object({
	id: z.coerce.number(),
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

	if (!emailValidator.validate(changes.email)) {
		throw createError({
			message: 'EMAIL_INVALID',
			status: StatusCodes.BAD_REQUEST,
		});
	}

	user = db.createUser({ ...user, ...changes });
	await db.update(user);

	user = await db.findById(user.id);
	return hideSecrets(user);
});

function removeUserLogoFile(user: User) {
	if (user.logo) {
		const fn = `.${user.logo}`; // make it relative for server
		if (fs.existsSync(fn)) {
			fs.unlinkSync(fn);
		}
	}
}
