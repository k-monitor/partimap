import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { findByEmail, updateLastLogin } from '~/server/data/users';

const loginBodySchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
	token: z.string().min(1),
});

export default defineEventHandler(async (event) => {
	const { email, password } = await readValidatedBody(event, loginBodySchema.parse);

	await validateCaptcha(event);

	const user = await findByEmail(email);
	if (!user || !user.active || !user.password || !bcrypt.compareSync(password, user.password)) {
		throw createError({ statusCode: StatusCodes.UNAUTHORIZED });
	}

	const session = await useAuthSession(event);
	await session.update({ userId: user.id });
	await updateLastLogin(user.id);
	return session;
});
