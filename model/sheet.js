class Sheet {
	/**
	 * @param {Object} data
	 * @param {Number} data.id
	 * @param {Number} data.projectId
	 * @param {Number} data.ord Index within project, managed in sheet.db
	 * @param {String} data.title
	 * @param {String} data.description
	 * @param {String} data.image
	 * @param {String} data.survey
	 * @param {String} data.features If truthy, sheet must display map
	 * @param {String} data.interactions
	 * @param {String} data.descriptionLabel
	 */
	constructor(data) {
		this.id = data.id;
		this.projectId = data.projectId;
		this.ord = data.ord;
		this.title = data.title;
		this.description = data.description;
		this.image = data.image;
		this.survey = data.survey;
		this.features = data.features;
		this.interactions = data.interactions;
		this.descriptionLabel = data.descriptionLabel;
	}
};

module.exports = Sheet;
