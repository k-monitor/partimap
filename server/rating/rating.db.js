const db = require('../db');
const Rating = require('../../model/rating');
const AggregatedRating = require('../../model/aggregatedRating');

/**
 * @param {Rating} rating
 * @returns {Number|Boolean}
 */
function create(rating) {
	return db.create('rating', rating, Rating);
}

/**
 * @param {Number} sheetId
 * @return {AggregatedRating[]}
 */
async function aggregateBySheetId(sheetId) {
	const rows = await db.query('SELECT featureId, COUNT(rating) count, AVG(rating) average FROM rating WHERE sheetID = ? GROUP BY featureID', [sheetId]);
	return rows.map(r => new AggregatedRating(r));
}

/**
 * @param {Number} projectId
 * @returns {Rating[]}
 */
async function findByProjectId(projectId) {
	const rows = await db.query('SELECT r.* FROM rating r INNER JOIN sheet s ON s.id = r.sheetId AND s.projectId = ?', [projectId]);
	return rows.map(r => new Rating(r));
}

module.exports = {
	create,
	aggregateBySheetId,
	findByProjectId,
};
