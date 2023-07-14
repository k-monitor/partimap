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
 * @return {Promise}
 */
function del(id) {
	return db.transaction(delQueries(id));
}

function delQueries(id) {
	return [
		{
			statement: 'DELETE FROM project WHERE id = ?',
			args: [id],
		},
		{
			statement: 'DELETE FROM sheet WHERE projectId = ?',
			args: [id],
		},
		{
			statement:
				'DELETE a FROM submitted_features a INNER JOIN submission s ON s.id = a.submissionId WHERE s.projectId = ?',
			args: [id],
		},
		{
			statement:
				'DELETE a FROM survey_answer a INNER JOIN submission s ON s.id = a.submissionId WHERE s.projectId = ?',
			args: [id],
		},
		{
			statement:
				'DELETE a FROM rating a INNER JOIN submission s ON s.id = a.submissionId WHERE s.projectId = ?',
			args: [id],
		},
		{
			statement: 'DELETE FROM submission WHERE projectId = ?',
			args: [id],
		},
	];
}

/**
 * @returns {Project[]}
 */
async function findAll() {
	const rows = await db.query(
		`SELECT p.*, COUNT(s.id) submissions
		FROM project p
		LEFT JOIN submission s ON s.projectId = p.id
		GROUP BY p.id`
	);
	return rows.map(r => new Project(r));
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
	if (!project) {
		// we got slug OR no match for ID
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
	const rows = await db.query(
		`SELECT p.*, COUNT(s.id) submissions
		FROM project p
		LEFT JOIN submission s ON s.projectId = p.id
		WHERE p.userId = ?
		GROUP BY p.id`,
		[userId]
	);
	return rows.map(r => new Project(r));
}

function incrementViewsById(id) {
	return db.query('UPDATE project SET views = views + 1 WHERE id = ?', [id]);
}

/**
 * @param {Project} project
 */
function update(project) {
	return db.update('project', project, Project);
}

/**
 * @returns {{ id: Number, lang: String, title: String, unsubscribeToken: String, email: String, submissions: Number, newSubmissions: Number }[]}
 */
function dataForDailyNotifications() {
	const sql = `
		SELECT
			p.id,
			p.lang,
			p.title,
			p.unsubscribeToken,
			COUNT(s.id) submissions,
			SUM(CASE
				WHEN s.timestamp > p.lastSent
				THEN 1
				ELSE 0
			END) newSubmissions,
			u.email,
			u.name
		FROM project p
		INNER JOIN submission s ON s.projectId = p.id
		INNER JOIN user u ON u.id = p.userId
		WHERE subscribe = 'D'
		GROUP BY p.id
		HAVING newSubmissions > 0;`;
	return db.query(sql);
}

/**
 * @param {Number} debounceMins Only return projects where last submission is older than X minutes
 * @returns {{ id: Number, lang: String, title: String, unsubscribeToken: String, email: String, submissions: Number, newSubmissions: Number }[]}
 */
function dataForEventBasedNotifications(debounceMins) {
	const sql = `
		SELECT
			p.id,
			p.lang,
			p.title,
			p.unsubscribeToken,
			COUNT(s.id) submissions,
			SUM(CASE
				WHEN s.timestamp > p.lastSent
				THEN 1
				ELSE 0
			END) newSubmissions,
			u.email,
			u.name
		FROM project p
		INNER JOIN submission s ON s.projectId = p.id
		INNER JOIN user u ON u.id = p.userId
		WHERE subscribe = 'E'
		GROUP BY p.id
		HAVING newSubmissions > 0
		AND MAX(s.timestamp)/1000 < UNIX_TIMESTAMP(NOW()) - 60 * ?;
	`;
	return db.query(sql, [debounceMins]);
}

function updateLastSent(id) {
	return db.query('UPDATE project SET lastSent = ? WHERE id = ?', [
		Date.now(),
		id,
	]);
}

/**
 * @param {Number} id
 * @param {String} token
 * @returns {Boolean}
 */
async function attemptToUnsubscribe(id, token) {
	const sql = `
		UPDATE project
		SET subscribe = "N"
		WHERE id = ?
		AND unsubscribeToken = ?`;
	const r = await db.query(sql, [id, token]);
	return !!r.affectedRows;
}

module.exports = {
	attemptToUnsubscribe,
	create,
	del,
	delQueries,
	findAll,
	findById,
	findByIdOrSlug,
	findBySlug,
	findByUserId,
	incrementViewsById,
	update,
	updateLastSent,
	dataForDailyNotifications,
	dataForEventBasedNotifications,
};
