const db = require('../db');
const sdb = require('../sheet/sheet.db');
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
 * @return {Object[]}
 */
async function aggregateByProjectId(projectId) {
	const sheets = await sdb.findByProjectId(projectId);

	/** @type {{ questionId: Number, type: String, sheetId: Number }[]} */
	const questions = [];
	for (const s of sheets) {
		const survey = JSON.parse(s.survey || '{}');
		if (survey.showResults) {
			const qs = survey.questions || [];
			questions.push(...qs.map(q => ({ ...q, sheetId: s.id })));
		}
	}

	if (!questions.length) {
		return [];
	}

	/** @type {{ questionId: Number, count: Number, average: Number }[]} */
	const averagesByQuestion = await db.query(`
		SELECT questionId, COUNT(answer) count, avg(answer) average
		FROM survey_answer a
		INNER JOIN sheet s ON s.id = a.sheetId AND s.projectId = ?
		GROUP BY questionId
	`, [projectId]);

	/** @type {{ questionId: Number, answer: String, count: Number }[]} */
	const countsByAnswer = await db.query(`
		SELECT questionId, answer, COUNT(answer) count
		FROM survey_answer a
		INNER JOIN sheet s ON s.id = a.sheetId AND s.projectId = ?
		GROUP BY questionId, answer
	`, [projectId]);

	const results = [];
	for (const q of questions) {
		if (q.type === 'text') {
			continue;
		}

		const { average, count } = averagesByQuestion
			.filter(e => Number(e.questionId) === q.id)[0];
		if (count < 1) {
			continue;
		}

		const result = {
			questionId: q.id,
			question: q.label,
			sheetId: q.sheetId,
			type: q.type,
			average,
			count
		};
		if (q.type === 'checkbox') {
			const opts = {};
			countsByAnswer
				.filter(e => Number(e.questionId) === q.id)
				.forEach(e => {
					JSON.parse(e.answer).forEach(o => {
						opts[o] = (opts[o] || 0) + 1;
					});
				});
			result.options = Object.entries(opts)
				.map(([answer, count]) => ({ answer, count }));
		} else {
			result.options = countsByAnswer
				.filter(e => Number(e.questionId) === q.id)
				.map(({ answer, count }) => ({ answer, count }));
			if ('number|range'.includes(q.type) && result.options.length > 10) {
				continue;
			}
		}

		results.push(result);
	}
	return results;
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
	aggregateByProjectId,
	create,
	findByProjectId,
};
