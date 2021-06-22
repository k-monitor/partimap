const db = require('../db');
const Inst = require('../../model/inst');

/**
 * @param {Inst} inst
 * @returns {Number|Boolean}
 */
function create(inst) {
	return db.create('inst', inst, Inst);
}

/**
 * @returns {Inst[]}
 */
function findAll() {
	return db.findAll('inst', Inst);
}

/**
 * @param {Number} id
 * @returns {Inst}
 */
function findById(id) {
	return db.findBy('inst', 'id', id, Inst);
}

/**
 * @param {String} name
 * @returns {Inst}
 */
function findByName(name) {
	return db.findBy('inst', 'name', name, Inst);
}

/**
 * @param {Number} id
 */
function remove(id) {
	return db.query('DELETE FROM inst WHERE id = ?', [id]);
}

/**
 * @param {Inst} inst
 */
function update(inst) {
	return db.update('inst', inst, Inst);
}

module.exports = {
	create,
	findAll,
	findById,
	findByName,
	remove,
	update
};
