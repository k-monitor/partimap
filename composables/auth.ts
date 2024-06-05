export const useAuth = () => useNuxtApp().$auth;

export const authLogin = async (email: string, password: string, captcha: string) => {
	await $fetch('/api/auth/login', {
		method: 'POST',
		body: { email, password, captcha },
	});
	await useAuth().updateSession();
};

export const authRegister = async (email: string, password: string) => {
	await $fetch('/api/auth/register', {
		method: 'POST',
		body: { email, password },
	});
};

export const authLogout = async () => {
	await $fetch('/api/auth/logout', {
		method: 'POST',
	});
	await useAuth().updateSession();
};
