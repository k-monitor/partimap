const db = require('../db');
const Submission = require('../../model/submission');

/**
 * @param {Submission} submission
 * @returns {Number|Boolean}
 */
function create(submission) {
	return db.create('submission', submission, Submission);
}

/**
 * @param {Number} id
 */
async function del(id) {
	await db.query('DELETE FROM submission WHERE id = ?', [id]);
	await db.query('DELETE FROM submitted_features WHERE submissionId = ?', [id]);
	await db.query('DELETE FROM survey_answer WHERE submissionId = ?', [id]);
	await db.query('DELETE FROM rating WHERE submissionId = ?', [id]);
}

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
	const rows = await db.query('SELECT * FROM submission WHERE projectId = ?', [projectId]);
	return rows.map(r => new Submission(r));
}

module.exports = {
	create,
	del,
	findById,
	findByProjectId
};
