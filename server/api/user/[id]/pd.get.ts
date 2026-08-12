import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import * as db from '~/server/data/users';

const paramsSchema = z.object({
	id: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

	await ensureLoggedIn(event);
	await ensureOwnAccount(event, id);

	const user = await db.findById(id);
	if (!user) throw createError({ status: StatusCodes.NOT_FOUND });

	// FIXME add audit log entry about access

	return {
		fullName: decryptField(user.eFullName) || user.name,
		address: decryptField(user.eAddress),
		birthPlace: decryptField(user.eBirthPlace),
		birthDate: decryptField(user.eBirthDate),
	};
});
