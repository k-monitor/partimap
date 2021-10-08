const db = require('../db');
const SurveyAnswer = require('../../model/surveyAnswer');

/**
 * @param {SurveyAnswer} surveyAnswer
 * @returns {Number|Boolean}
 */
function create(surveyAnswer) {
	return db.create('survey_answer', surveyAnswer, SurveyAnswer);
}

module.exports = {
	create,
};
