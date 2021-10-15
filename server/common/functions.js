function hidePasswordField(obj) {
	// We store hashes of course, but better to keep them inside too. :)
	if (Array.isArray(obj)) {
		return obj.map(hidePasswordField);
	}
	return obj && obj.password !== undefined
		? { ...obj, password: (obj.password || '').length > 0 } // null and '' means no password
		: obj;
}

module.exports = {
	hidePasswordField,
};
