const db = require('../db');
const SubmittedFeatures = require('../../model/submittedFeatures');

/**
 * @param {SubmittedFeatures} submittedFeatures
 * @returns {Number|Boolean}
 */
function create(submittedFeatures) {
	return db.create('submitted_features', submittedFeatures, SubmittedFeatures);
}

module.exports = {
	create,
};
