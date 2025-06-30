import type { H3Event } from 'h3';

export async function validateCaptcha(event: H3Event) {
	const { captcha } = await readBody(event);
	await verifyTurnstileToken(captcha);
}
