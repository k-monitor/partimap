const { jsonrepair } = require('jsonrepair');

function safeParseJSON(json) {
	try {
		return JSON.parse(json);
	} catch {
		return null;
	}
}

function repairAndParseJSON(json) {
	try {
		return safeParseJSON(jsonrepair(json));
	} catch {
		return null;
	}
}

function safeParseJSONArray(json) {
	const o = safeParseJSON(json) || repairAndParseJSON(json);
	return Array.isArray(o) ? o : [];
}

module.exports = {
	safeParseJSON,
	repairAndParseJSON,
	safeParseJSONArray,
};
