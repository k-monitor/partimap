import { useReCaptcha } from 'vue-recaptcha-v3';

export default function f() {
	const recaptchaInstance = useReCaptcha();

	async function executeReCaptcha(action: string) {
		await recaptchaInstance?.recaptchaLoaded();
		const token = await recaptchaInstance?.executeRecaptcha(action);
		return token;
	}

	return { executeReCaptcha };
}
