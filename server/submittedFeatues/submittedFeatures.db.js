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

module.exports = {
	create,
	findByProjectId
};
