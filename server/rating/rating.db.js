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
	const sql = `
		SELECT
			featureId,
			COUNT(rating) count,
			SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) likeCount,
			SUM(CASE WHEN rating = -1 THEN 1 ELSE 0 END) dislikeCount,
			SUM(rating) sum,
			AVG(rating) average
		FROM rating
		WHERE sheetID = ?
		GROUP BY featureID;`;
	const rows = await db.query(sql, [sheetId]);
	return rows.map(r => new AggregatedRating(r));
}

/**
 * @param {Number} projectId
 * @returns {Rating[]}
 */
async function findByProjectId(projectId) {
	const rows = await db.query(
		'SELECT r.* FROM rating r INNER JOIN sheet s ON s.id = r.sheetId AND s.projectId = ?',
		[projectId]
	);
	return rows.map(r => new Rating(r));
}

module.exports = {
	create,
	aggregateBySheetId,
	findByProjectId,
};
