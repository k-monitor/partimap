class Project {
	/**
	 * @param {Object} data
	 * @param {Number} data.id
	 * @param {Number} data.userId
	 * @param {String} data.slug
	 * @param {String} data.title
	 * @param {String} data.description
	 * @param {String} data.password
	 */
	constructor(data) {
		this.id = data.id;
		this.userId = data.userId;
		this.slug = data.slug;
		this.title = data.title;
		this.description = data.description;
		this.password = data.password;
	}
};

module.exports = Project;
