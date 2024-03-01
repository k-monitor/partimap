const db = require('../db');
const Map = require('../../model/map');

/**
 * @param {Map} map
 * @returns {Number|Boolean}
 */
function create(map) {
	return db.create('map', map, Map);
}

/**
 * @param {Number} id
 */
function del(id) {
	return db.del('map', id);
}

/**
 * @returns {Map[]}
 */
function findAll() {
	return db.findAll('map', Map);
}

/**
 * @param {Number} id
 * @returns {Map}
 */
function findById(id) {
	return db.findBy('map', 'id', id, Map);
}

/**
 * @param {Number} userId
 * @returns {Map[]}
 */
async function findByUserId(userId) {
	const rows = await db.query('SELECT * FROM map WHERE userId = ?', [userId]);
	return rows.map(r => new Map(r));
}

/**
 * @param {Map} map
 */
function update(map) {
	return db.update('map', map, Map);
}

module.exports = {
	create,
	del,
	findAll,
	findById,
	findByUserId,
	update,
};
