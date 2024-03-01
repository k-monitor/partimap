const db = require('../db');
const mdb = require('../map/map.db');
const pdb = require('../project/project.db');
const User = require('../../model/user');

/**
 * @param {User} user
 * @returns {Number|Boolean}
 */
function create(user) {
	return db.create('user', user, User);
}

/**
 * @param {Number} id
 */
async function del(id) {
	const delProjectQueries = [];

	const projects = await pdb.findByUserId(id);
	for (const project of projects) {
		delProjectQueries.push(...pdb.delQueries(project.id));
	}

	await db.transaction([
		{
			statement: 'DELETE FROM user WHERE id = ?',
			args: [id],
		},
		{
			statement: 'DELETE FROM map WHERE userId = ?',
			args: [id],
		},
		...delProjectQueries,
	]);
}

/**
 * @returns {User[]}
 */
function findAll() {
	return db.findAll('user', User);
}

/**
 * @param {Number} id
 * @returns {User}
 */
function findById(id) {
	return db.findBy('user', 'id', id, User);
}

/**
 * @param {String} email
 * @returns {User}
 */
function findByEmail(email) {
	return db.findBy('user', 'email', email, User);
}

/**
 * @param {String} token
 * @returns {User}
 */
function findByToken(token) {
	return db.findBy('user', 'token', token, User);
}

/**
 * @param {User} user
 */
function update(user) {
	return db.update('user', user, User);
}

module.exports = {
	create,
	del,
	findAll,
	findById,
	findByEmail,
	findByToken,
	update,
};
