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
 * @param {Number} instId
 * @returns {Project[]}
 */
async function findByInstId(instId) {
	const rows = await db.query('SELECT * FROM project WHERE instId = ?', [instId]);
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
	findAll,
	findById,
	findByInstId,
	update
};
