export default defineNuxtRouteMiddleware((to) => {
	const { loggedIn } = useAuth();
	const localePath = useLocalePath();
	if (String(to.name).startsWith('admin') && !loggedIn.value) {
		return navigateTo({
			path: localePath('/login'),
			query: { redirect: to.path },
		});
	}
});
