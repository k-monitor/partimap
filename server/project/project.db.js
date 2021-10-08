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
	await db.query('DELETE a FROM submitted_features a INNER JOIN submission s ON s.id = a.submissionId WHERE s.projectId = ?', [id]);
	await db.query('DELETE a FROM survey_answer a INNER JOIN submission s ON s.id = a.submissionId WHERE s.projectId = ?', [id]);
	await db.query('DELETE a FROM rating a INNER JOIN submission s ON s.id = a.submissionId WHERE s.projectId = ?', [id]);
	await db.query('DELETE FROM submission WHERE projectId = ?', [id]);
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
 * @param {Number|String} idOrSlug
 * @returns {Project}
 */
async function findByIdOrSlug(idOrSlug) {
	let project;
	if (Number(idOrSlug) > 0) {
		project = await findById(idOrSlug);
	}
	if (!project) { // we got slug OR no match for ID
		project = await findBySlug(idOrSlug);
	}
	return project;
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
	findByIdOrSlug,
	findBySlug,
	findByUserId,
	update
};
