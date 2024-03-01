class Rating {
	/**
	 * @param {Object} data
	 * @param {Number} data.id
	 * @param {Number} data.submissionId
	 * @param {Number} data.sheetId
	 * @param {Number} data.featureId
	 * @param {Number} data.rating
	 * @param {String} data.question
	 * @param {String} data.answer
	 * @param {String} data.pros
	 * @param {String} data.cons
	 */
	constructor(data) {
		this.id = data.id;
		this.submissionId = data.submissionId;
		this.sheetId = data.sheetId;
		this.featureId = data.featureId;
		this.rating = data.rating;
		this.question = data.question;
		this.answer = data.answer;
		this.pros = data.pros;
		this.cons = data.cons;
	}
}

module.exports = Rating;
