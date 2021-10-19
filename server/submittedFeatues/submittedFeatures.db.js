const db = require('../db');
const SubmittedFeatures = require('../../model/submittedFeatures');

/**
 * @param {SubmittedFeatures} submittedFeatures
 * @returns {Number|Boolean}
 */
function create(submittedFeatures) {
	return db.create('submitted_features', submittedFeatures, SubmittedFeatures);
}

/**
 * @param {Number} projectId
 * @returns {{sheetId: Number, features: String}[]}
 */
function findByProjectId(projectId) {
	return db.query(`
		select f.sheetId, f.features
		from submitted_features f
		inner join sheet s on s.id = f.sheetId
		where s.projectId = ?`, [projectId]);
}

/**
 * @param {Number} sheetId
 * @returns {SubmittedFeatures[]}
 */
async function findBySheetId(sheetId) {
	const rows = await db.query('SELECT * FROM submitted_features WHERE sheetId = ?', [sheetId]);
	return rows.map(r => new SubmittedFeatures(r));
}

module.exports = {
	create,
	findByProjectId,
	findBySheetId
};
