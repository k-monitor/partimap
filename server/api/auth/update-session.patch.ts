export default defineEventHandler(async (event) => {
	await ensureLoggedIn(event);
	updateSessionExpiration(event);
});
