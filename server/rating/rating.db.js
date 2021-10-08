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
	const rows = await db.query('SELECT featureID, COUNT(rating) count, SUM(rating)/COUNT(rating) average FROM rating WHERE sheetID = ? GROUP BY featureID', [sheetId]);
	return rows.map(r => new AggregatedRating(r));
}

module.exports = {
	create,
	aggregateBySheetId,
};
