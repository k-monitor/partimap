export function hideSecrets(obj: Object): Object {
	// We store hashes of course, but better to keep them inside too. :)
	if (Array.isArray(obj)) {
		return obj.map(hideSecrets);
	}

	hideField(obj, 'password');
	hideField(obj, 'token');
	return obj;
}

function hideField(obj: any, field: string) {
	if (obj && obj[field] !== undefined) {
		obj[field] = (obj[field] || '').length > 0;
	}
}
