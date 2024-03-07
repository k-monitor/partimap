import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

const loginBodySchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
	token: z.string().min(1),
});

export default defineEventHandler(async (event) => {
	const { email, password } = await readValidatedBody(event, loginBodySchema.parse);

	await validateCaptcha(event);

	const user = await findUserByEmail(email);
	if (!user || !user.password || !bcrypt.compareSync(password, user.password)) {
		throw createError({ statusCode: StatusCodes.UNAUTHORIZED });
	}

	const session = await useAuthSession(event);
	await session.update({
		id: user.id,
		name: user.name,
		isAdmin: user.isAdmin,
	});
	await updateUserLastLogin(user.id);
	return session;
});
