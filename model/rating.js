class Rating {
	/**
	 * @param {Object} data
	 * @param {Number} data.id
	 * @param {Number} data.submissionId
	 * @param {Number} data.sheetId
	 * @param {Number} data.featureId
	 * @param {Number} data.rating
	 */
	constructor(data) {
		this.id = data.id;
		this.submissionId = data.submissionId;
		this.sheetId = data.sheetId;
		this.featureId = data.featureId;
		this.rating = data.rating;
	}
};

module.exports = Rating;
