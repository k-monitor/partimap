const NORSTAT_PARAMS = ['source', 'state'] as const;
export const CAPTURED_PARAMS = Array.from(new Set([...NORSTAT_PARAMS]));

export function isAcceptable(value: string) {
	return value.length <= 256 && /^[a-zA-Z0-9_\-=/+]*$/.test(value);
}

export type CapturedParams = { [key in (typeof CAPTURED_PARAMS)[number]]?: string };

export function captureParams(query: Record<string, string | string[] | undefined>) {
	const captured: CapturedParams = {};
	for (const key of CAPTURED_PARAMS) {
		const value = query[key];
		if (typeof value === 'string' && isAcceptable(value)) {
			captured[key] = value;
		}
	}
	return captured;
}

export function interpolateParams(text: string, params: CapturedParams) {
	return text.replace(/\{([a-zA-Z0-9_\-]+)\}/g, (match, key) => {
		if (CAPTURED_PARAMS.includes(key as keyof CapturedParams)) {
			const value = params[key as keyof CapturedParams];
			return encodeURIComponent(value || '');
		}
		return match;
	});
}
