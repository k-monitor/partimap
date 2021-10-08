class SurveyAnswer {
	/**
	 * @param {Object} data
	 * @param {Number} data.id
	 * @param {Number} data.submissionId
	 * @param {Number} data.sheetId
	 * @param {String} data.questionId
	 * @param {String} data.answer
	 */
	constructor(data) {
		this.id = data.id;
		this.submissionId = data.submissionId;
		this.sheetId = data.sheetId;
		this.questionId = data.questionId;
		this.answer = data.answer;
	}
};

module.exports = SurveyAnswer;
