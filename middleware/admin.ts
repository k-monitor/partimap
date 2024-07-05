export default defineNuxtRouteMiddleware(() => {
	const { user } = useAuth();
	const localePath = useLocalePath();
	if (!user.value?.isAdmin) return navigateTo(localePath('/admin'));
});
