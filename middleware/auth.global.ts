export default defineNuxtRouteMiddleware((to) => {
	const error = useError();
	if (error.value) return; // useAuth isn't working on error pages

	const { loggedIn } = useAuth();
	const localePath = useLocalePath();
	if (String(to.name).startsWith('admin') && !loggedIn.value) {
		return navigateTo({
			path: localePath('/login'),
			query: { redirect: to.path },
		});
	}
});
