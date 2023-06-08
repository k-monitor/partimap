const db = require('../db');
const Submission = require('../../model/submission');
const Rating = require('~/model/rating');
const SurveyAnswer = require('~/model/surveyAnswer');
const SubmittedFeatures = require('~/model/submittedFeatures');

/**
 * @param {Submission} submission
 * @param {Rating[]} ratings
 * @param {SurveyAnswer[]} answers
 * @param {SubmittedFeatures[]} features
 * @returns {Promise<Number|Boolean>}
 */
async function create(submission, ratings, answers, features) {
	let submissionId = -1;
	await db.inTransaction(async connection => {
		const cq = db.createQuery('submission', submission, Submission);
		const [rows] = await connection.execute(cq.statement, cq.args);
		const { insertId } = rows;
		if (!insertId || insertId < 0) {
			throw new Error(`Invalid insertId: ${insertId}`);
		}
		submissionId = insertId;

		const queries = [
			...ratings.map(e => {
				e.submissionId = submissionId;
				return db.createQuery('rating', e, Rating);
			}),
			...answers.map(e => {
				e.submissionId = submissionId;
				return db.createQuery('survey_answer', e, SurveyAnswer);
			}),
			...features.map(e => {
				e.submissionId = submissionId;
				return db.createQuery(
					'submitted_features',
					e,
					SubmittedFeatures
				);
			}),
		];
		await db.runQueries(connection, queries);
	});
	return submissionId;
}

/**
 * @param {Number} id
 */
/* async function del(id) {
	await db.query('DELETE FROM submission WHERE id = ?', [id]);
	await db.query('DELETE FROM submitted_features WHERE submissionId = ?', [
		id,
	]);
	await db.query('DELETE FROM survey_answer WHERE submissionId = ?', [id]);
	await db.query('DELETE FROM rating WHERE submissionId = ?', [id]);
} */

/**
 * @param {Number} id
 * @returns {Submission}
 */
function findById(id) {
	return db.findBy('submission', 'id', id, Submission);
}

/**
 * @param {Number} projectId
 * @returns {Submission[]}
 */
async function findByProjectId(projectId) {
	const rows = await db.query(
		'SELECT * FROM submission WHERE projectId = ?',
		[projectId]
	);
	return rows.map(r => new Submission(r));
}

module.exports = {
	create,
	findById,
	findByProjectId,
};
