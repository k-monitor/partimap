const db = require('../db');
const Inst = require('../../model/inst');

/**
 * @param {Inst} inst
 * @returns {Number|Boolean}
 */
async function create(inst) {
	inst = { ...inst };
	delete inst.id;
	const i = db.sqlize(inst);
	const { insertId } = await db.query(`INSERT IGNORE INTO inst (${i.cols}) VALUES (${i.qmarks})`, i.values);
	return insertId > 0 ? insertId : false;
}

/**
 * @returns {Inst[]}
 */
async function findAll() {
	const rows = await db.query('SELECT * FROM inst');
	return rows.map(r => new Inst(r));
}

/**
 * @param {Number} id
 * @returns {Inst}
 */
async function findById(id) {
	const rows = await db.query('SELECT * FROM inst WHERE id = ?', [id]);
	return rows.map(r => new Inst(r))[0];
}

/**
 * @param {String} name
 * @returns {Inst}
 */
async function findByName(name) {
	const rows = await db.query('SELECT * FROM inst WHERE name = ?', [name]);
	return rows.map(r => new Inst(r))[0];
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
	const { id } = inst;
	inst = { ...inst };
	delete inst.id;
	const i = db.sqlize(inst);
	return db.query(`UPDATE inst SET ${i.sets} WHERE id = ?`, [...i.values, id]);
}

module.exports = {
	create,
	findAll,
	findById,
	findByName,
	remove,
	update
};
