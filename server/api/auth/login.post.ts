import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
	const session = await useAuthSession(event);
	const { email, password } = await readBody(event);
	const user = await findUserByEmail(email);
	if (!user) {
		throw createError({
			message: 'Email not found! Please register.',
			statusCode: 401,
		});
	}
	if (!user.password || !bcrypt.compareSync(password, user.password)) {
		throw createError({
			message: 'Incorrect password!',
			statusCode: 401,
		});
	}
	await session.update({
		id: user.id,
		name: user.name,
		isAdmin: user.isAdmin,
	});
	await updateUserLastLogin(user.id);
	return session;
});
