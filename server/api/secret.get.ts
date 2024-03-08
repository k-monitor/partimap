export default defineEventHandler(async (event) => {
	await ensureLoggedIn(event);
	return {
		eventContextUser: event.context.user,
	};
});
