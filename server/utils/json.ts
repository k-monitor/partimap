import { jsonrepair } from 'jsonrepair';

export function safeParseJSON(json: string) {
	try {
		return JSON.parse(json);
	} catch {
		return null;
	}
}

export function repairAndParseJSON(json: string) {
	try {
		return safeParseJSON(jsonrepair(json));
	} catch {
		return null;
	}
}

export function safeParseJSONArray(json: string) {
	const o = safeParseJSON(json) || repairAndParseJSON(json);
	return Array.isArray(o) ? o : [];
}
