class Project {
	/**
	 * @param {Object} data
	 * @param {Number} data.id
	 * @param {Number} data.userId
	 * @param {String} data.slug
	 * @param {String} data.title
	 * @param {String} data.description
	 * @param {String} data.password
	 * @param {Number} data.views
	 * @param {Number} data.submissions
	 */
	constructor(data) {
		this.id = data.id;
		this.userId = data.userId;
		this.slug = data.slug;
		this.title = data.title;
		this.description = data.description;
		this.password = data.password;
		this.views = data.views;

		// calculated:
		this.submissions = data.submissions;
	}
};

module.exports = Project;
