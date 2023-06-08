const db = require('../db');
const sdb = require('../sheet/sheet.db');
const { OTHER_ANSWER, OTHER_PREFIX } = require('../../assets/constants');
const SurveyAnswer = require('../../model/surveyAnswer');

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
		if (survey.showResults || survey.showResultsOnly) {
			const qs = survey.questions || [];
			questions.push(...qs.map(q => ({ ...q, sheetId: s.id })));
		}
	}

	if (!questions.length) {
		return [];
	}

	/** @type {{ questionId: Number, count: Number, average: Number }[]} */
	const averagesByQuestion = await db.query(
		`SELECT questionId, COUNT(answer) count, AVG(answer) average
		FROM survey_answer a
		INNER JOIN sheet s ON s.id = a.sheetId AND s.projectId = ?
		GROUP BY questionId`,
		[projectId]
	);

	/** @type {{ questionId: Number, answer: String, count: Number }[]} */
	const countsByAnswer = await db.query(
		`SELECT questionId, answer, COUNT(answer) count
		FROM survey_answer a
		INNER JOIN sheet s ON s.id = a.sheetId AND s.projectId = ?
		GROUP BY questionId, answer`,
		[projectId]
	);

	const matrixAnswersByQuestion = new Map();
	await Promise.all(
		questions
			.filter(q => q.type.includes('Matrix'))
			.map(async q => {
				const answers = await db.query(
					`SELECT answer FROM survey_answer a
					INNER JOIN sheet s ON s.id = a.sheetId AND s.projectId = ?
					AND a.questionId = ?`,
					[projectId, q.id]
				);
				matrixAnswersByQuestion.set(
					q.id,
					answers.map(a => a.answer)
				);
			})
	);

	const results = [];
	for (const q of questions) {
		if (q.type === 'text') {
			continue;
		}

		if (q.type.includes('Matrix')) {
			const answers = (matrixAnswersByQuestion.get(q.id) || [])
				.map(a => {
					try {
						return JSON.parse(a);
					} catch {
						return false;
					}
				})
				.filter(a => !!a);
			if (!answers) {
				continue;
			}

			(q.rows || []).forEach((row, i) => {
				let count = 0;
				const opts = {};
				answers
					.map(a => a[row])
					.filter(a => !!a)
					.forEach(a => {
						count++;
						a = Array.isArray(a) ? a : [a];
						a.forEach(col => {
							opts[col] = (opts[col] || 0) + 1;
						});
					});
				const result = {
					questionId: `${q.id}/${i}`,
					question: `${q.label} [${row}]`,
					sheetId: q.sheetId,
					type: q.type,
					count,
					options: Object.entries(opts).map(([answer, count]) => ({
						answer,
						count,
					})),
				};
				results.push(result);
			});
			continue;
		}

		const abq = averagesByQuestion.filter(
			e => Number(e.questionId) === q.id
		)[0];
		const average = abq?.average || 0;
		const count = abq?.count || 0;
		if (count < 1) {
			continue;
		}

		const result = {
			questionId: q.id,
			question: q.label,
			sheetId: q.sheetId,
			type: q.type,
			average,
			count,
		};
		if (q.type === 'checkbox') {
			const opts = {};
			countsByAnswer
				.filter(e => Number(e.questionId) === q.id)
				.forEach(e => {
					JSON.parse(e.answer).forEach(o => {
						if (o.startsWith(OTHER_PREFIX)) {
							o = OTHER_ANSWER;
						}
						opts[o] = (opts[o] || 0) + 1;
					});
				});
			result.options = Object.entries(opts).map(([answer, count]) => ({
				answer,
				count,
			}));
		} else {
			const opts = {};
			countsByAnswer
				.filter(e => Number(e.questionId) === q.id)
				.map(e => {
					if (`${e.answer}`.startsWith(OTHER_PREFIX)) {
						e.answer = OTHER_ANSWER;
					}
					return e;
				})
				.forEach(e => {
					opts[e.answer] = (opts[e.answer] || 0) + e.count;
				});
			result.options = Object.entries(opts).map(([answer, count]) => ({
				answer,
				count,
			}));
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
	const rows = await db.query(
		'SELECT a.* FROM survey_answer a INNER JOIN sheet s ON s.id = a.sheetId AND s.projectId = ?',
		[projectId]
	);
	return rows.map(r => new SurveyAnswer(r));
}

module.exports = {
	aggregateByProjectId,
	findByProjectId,
};
