import { jsonrepair } from 'jsonrepair';

export function safeParseJSON(json: string | null | undefined) {
	if (!json) return null;
	try {
		return JSON.parse(json);
	} catch {
		return null;
	}
}

export function repairAndParseJSON(json: string | null | undefined) {
	if (!json) return null;
	try {
		return safeParseJSON(jsonrepair(json));
	} catch {
		return null;
	}
}

export function safeParseJSONArray(json: string | null | undefined) {
	if (!json) return [];
	const o = safeParseJSON(json) || repairAndParseJSON(json);
	return Array.isArray(o) ? o : [];
}
