import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import * as db from '~/server/utils/database';
import * as ldb from '~/server/data/pdLog';
import * as udb from '~/server/data/users';

const paramsSchema = z.object({
	id: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

	const actor = await ensureLoggedIn(event);
	await ensureOwnAccount(event, id);

	const subject = await udb.findById(id);
	if (!subject) throw createError({ status: StatusCodes.NOT_FOUND });

	await db.inTransaction(async (tx) => {
		const queries = ldb.PD_FIELDS.map((field) =>
			ldb.createQuery({
				timestamp: Date.now(),
				actorId: actor.id,
				subjectId: subject.id,
				field,
				operation: 'reveal',
			}),
		);
		await db.runQueries(tx, queries);
	});

	return {
		fullName: decryptField(subject.eFullName) || subject.name,
		address: decryptField(subject.eAddress),
		birthPlace: decryptField(subject.eBirthPlace),
		birthDate: decryptField(subject.eBirthDate),
	};
});
