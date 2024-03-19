export default defineNuxtRouteMiddleware(() => {
	const { loggedIn } = useAuth();
	const localePath = useLocalePath();
	if (loggedIn.value) return navigateTo(localePath('/admin'));
});
