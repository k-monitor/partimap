export default defineEventHandler(async (event) => {
	const user = await ensureLoggedIn(event);
	return user;
});
