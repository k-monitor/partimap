import type { AuthSession } from '~/server/utils/session';

export default defineNuxtPlugin(async (nuxtApp) => {
	if (nuxtApp.payload.error) return {};

	const { data: session, refresh: updateSession } =
		await useFetch<AuthSession>('/api/auth/session');
	const loggedIn: any = computed(() => !!session.value?.id);

	if (process.client && loggedIn.value) {
		$fetch('/api/auth/update-session', { method: 'PATCH' });
	}

	const localePath = useLocalePath();
	const route = useRoute();
	watch(loggedIn, (loggedIn) => {
		if (loggedIn) {
			const redirect = (route.query?.redirect as string) || localePath('/admin');
			navigateTo(redirect);
		} else {
			navigateTo(localePath('/'));
		}
	});

	return {
		provide: {
			auth: {
				loggedIn,
				session,
				updateSession,
			},
		},
	};
});
