class Project {
	/**
	 * @param {Object} data
	 * @param {Number} data.id
	 * @param {Number} data.userId
	 * @param {String} data.title
	 * @param {String} data.description
	 */
	constructor(data) {
		this.id = data.id;
		this.userId = data.userId;
		this.title = data.title;
		this.description = data.description;
	}
};

module.exports = Project;
