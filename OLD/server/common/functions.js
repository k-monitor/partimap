function hidePasswordField(obj) {
	// We store hashes of course, but better to keep them inside too. :)
	if (Array.isArray(obj)) {
		return obj.map(hidePasswordField);
	}

	hideField(obj, 'password');
	hideField(obj, 'token');
	return obj;
}

function hideField(obj, field) {
	if (obj && obj[field] !== undefined) {
		obj[field] = (obj[field] || '').length > 0;
	}
}

module.exports = {
	hidePasswordField,
};
