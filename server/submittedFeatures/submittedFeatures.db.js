const db = require('../db');
const SubmittedFeatures = require('../../model/submittedFeatures');

/**
 * @param {SubmittedFeatures} submittedFeatures
 * @returns {Number|Boolean}
 */
function create(submittedFeatures) {
	return db.create(
		'submitted_features',
		submittedFeatures,
		SubmittedFeatures
	);
}

/**
 * @param {Number} projectId
 * @returns {SubmittedFeatures[]}
 */
async function findByProjectId(projectId) {
	const rows = await db.query(
		'SELECT f.* FROM submitted_features f INNER JOIN sheet s ON s.id = f.sheetId AND s.projectId = ?',
		[projectId]
	);
	return rows.map(r => new SubmittedFeatures(r));
}

/**
 * @param {Number} sheetId
 * @returns {SubmittedFeatures[]}
 */
async function findBySheetId(sheetId) {
	const rows = await db.query(
		'SELECT * FROM submitted_features WHERE sheetId = ?',
		[sheetId]
	);
	return rows.map(r => new SubmittedFeatures(r));
}

module.exports = {
	create,
	findByProjectId,
	findBySheetId,
};
