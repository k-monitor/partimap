const db = require('../db');
const SurveyAnswer = require('../../model/surveyAnswer');

/**
 * @param {SurveyAnswer} surveyAnswer
 * @returns {Number|Boolean}
 */
function create(surveyAnswer) {
	return db.create('survey_answer', surveyAnswer, SurveyAnswer);
}

/**
 * @param {Number} projectId
 * @returns {SurveyAnswer[]}
 */
async function findByProjectId(projectId) {
	const rows = await db.query('SELECT a.* FROM survey_answer a INNER JOIN sheet s ON s.id = a.sheetId AND s.projectId = ?', [projectId]);
	return rows.map(r => new SurveyAnswer(r));
}

module.exports = {
	create,
	findByProjectId,
};
