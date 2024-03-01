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
		const qs = (survey.questions || [])
			.filter(q => survey.showResults || q.showResult)
			.map(q => ({ ...q, sheetId: s.id }));
		questions.push(...qs);
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

	async function getAnswersByQuestion(questionPredicate) {
		const answersByQuestion = new Map();
		const filteredQuestions = questions.filter(questionPredicate);
		await Promise.all(
			filteredQuestions.map(async q => {
				const answers = await db.query(
					`SELECT answer FROM survey_answer a
					INNER JOIN sheet s ON s.id = a.sheetId AND s.projectId = ?
					AND a.questionId = ?`,
					[projectId, q.id]
				);
				answersByQuestion.set(
					q.id,
					answers.map(a => a.answer)
				);
			})
		);
		return answersByQuestion;
	}

	const distAnswersByQuestion = await getAnswersByQuestion(
		q => q.type === 'distributeUnits'
	);
	const matrixAnswersByQuestion = await getAnswersByQuestion(q =>
		q.type.includes('Matrix')
	);

	const results = [];
	for (const q of questions) {
		if (q.type === 'text') {
			continue;
		}

		if (q.type === 'distributeUnits') {
			const sums = new Map();
			const counts = new Map();
			const answers = (distAnswersByQuestion.get(q.id) || [])
				.map(a => {
					try {
						return JSON.parse(a);
					} catch {
						return false;
					}
				})
				.filter(a => !!a);
			answers.forEach(a => {
				Object.entries(a).forEach(([key, value]) => {
					if (!(q.options || []).includes(key)) return;
					sums.set(key, (sums.get(key) || 0) + value);
					counts.set(key, (counts.get(key) || 0) + 1);
				});
			});

			const result = {
				questionId: `${q.id}`,
				question: `${q.label}`,
				sheetId: q.sheetId,
				type: q.type,
				count: answers.length,
			};
			result.options = (q.options || [])
				.filter(o => counts.get(o))
				.map(o => ({
					answer: o,
					average:
						Math.round((10 * (sums.get(o) || 0)) / counts.get(o)) /
						10,
				}));
			results.push(result);
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
			if (!answers || !answers.length) continue;

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
