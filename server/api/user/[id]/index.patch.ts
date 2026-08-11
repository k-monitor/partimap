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
	delete changes.gdprBlockNoticeSent;
	delete changes.eFullName;
	delete changes.eAddress;
	delete changes.eBirthPlace;
	delete changes.eBirthDate;

	if (!event.context.user?.isAdmin) {
		delete changes.active;
		delete changes.isAdmin;

		if (changes.newPassword || (changes.email && changes.email !== user.email)) {
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

	if (user.id === event.context.user?.id) {
		if (changes.fullName) {
			changes.eFullName = encryptField(changes.fullName);
			changes.name = '';
		}
		if (changes.address) {
			changes.eAddress = encryptField(changes.address);
		}
		if (changes.birthPlace) {
			changes.eBirthPlace = encryptField(changes.birthPlace);
		}
		if (changes.birthDate) {
			changes.eBirthDate = encryptField(changes.birthDate);
		}
		// FIXME add audit log record for each modification!
	}

	user = db.createUser({ ...user, ...changes });
	await db.update(user);

	user = await db.findById(user.id);
	if (!user) throw createError({ status: StatusCodes.NOT_FOUND });
	return hideSecrets(user);
});
