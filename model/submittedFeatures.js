class SubmittedFeatures {
	/**
	 * @param {Object} data
	 * @param {Number} data.id
	 * @param {Number} data.submissionId
	 * @param {Number} data.sheetId
	 * @param {String} data.features
	 */
	constructor(data) {
		this.id = data.id;
		this.submissionId = data.submissionId;
		this.sheetId = data.sheetId;
		this.features = data.features;
	}
}

module.exports = SubmittedFeatures;
