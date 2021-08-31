const db = require('../db');
const Project = require('../../model/project');

/**
 * @param {Project} project
 * @returns {Number|Boolean}
 */
function create(project) {
	return db.create('project', project, Project);
}

/**
 * @param {Number} id
 */
async function del(id) {
	await db.query('DELETE FROM project WHERE id = ?', [id]);
	await db.query('DELETE FROM sheet WHERE projectId = ?', [id]);
	// TODO delete results, ratings too
}

/**
 * @returns {Project[]}
 */
function findAll() {
	return db.findAll('project', Project);
}

/**
 * @param {Number} id
 * @returns {Project}
 */
function findById(id) {
	return db.findBy('project', 'id', id, Project);
}

/**
 * @param {String} slug
 * @returns {Project}
 */
function findBySlug(slug) {
	return db.findBy('project', 'slug', slug, Project);
}

/**
 * @param {Number} userId
 * @returns {Project[]}
 */
async function findByUserId(userId) {
	const rows = await db.query('SELECT * FROM project WHERE userId = ?', [userId]);
	return rows.map(r => new Project(r));
}

/**
 * @param {Project} project
 */
function update(project) {
	return db.update('project', project, Project);
}

module.exports = {
	create,
	del,
	findAll,
	findById,
	findBySlug,
	findByUserId,
	update
};
