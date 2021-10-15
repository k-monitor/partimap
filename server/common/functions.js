function hidePasswordField(obj) {
	// We store hashes of course, but better to keep them inside too. :)
	if (Array.isArray(obj)) {
		return obj.map(hidePasswordField);
	}
	return obj && obj.password ? { ...obj, password: true } : obj;
}

module.exports = {
	hidePasswordField,
};
