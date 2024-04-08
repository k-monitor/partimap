import * as db from '~/server/utils/database';
import type { Sheet } from '~/server/data/sheets';
import { User } from '~/server/data/users';

export type Project = {
	id: number;
	userId: number;
	lang: string;
	slug: string;
	title: string;
	description: string;
	image: string;
	privacyPolicy: string;
	thanks: string;
	thanksUrl: string;
	thanksSocial: string;
	password: string;
	views: number;
	subscribe: string;
	unsubscribeToken: string;
	lastSent: number;

	// only in some API responses
	sheets?: Sheet[];
	submissions?: number;
	user?: Partial<User>;
};

export function createProject(data: any): Project {
	return {
		id: data.id,
		userId: data.userId,
		lang: data.lang,
		slug: data.slug,
		title: data.title,
		description: data.description,
		image: data.image,
		privacyPolicy: data.privacyPolicy,
		thanks: data.thanks,
		thanksUrl: data.thanksUrl,
		thanksSocial: data.thanksSocial,
		password: data.password,
		views: data.views,
		subscribe: data.subscribe,
		unsubscribeToken: data.unsubscribeToken,
		lastSent: data.lastSent,

		sheets: data.sheets,
		submissions: data.submissions,
		user: data.user,
	};
}

export function create(project: Project) {
	return db.create('project', project, createProject);
}

export function del(id: number) {
	return db.transaction(delQueries(id));
}

export function delQueries(id: number) {
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

export async function findAll() {
	const rows = await db.query(
		`SELECT p.*, COUNT(s.id) submissions
		FROM project p
		LEFT JOIN submission s ON s.projectId = p.id
		GROUP BY p.id`,
	);
	return rows.map((r) => createProject(r));
}

export async function findAllByUserId(userId: number) {
	const rows = await db.query(
		`SELECT p.*, COUNT(s.id) submissions
		FROM project p
		LEFT JOIN submission s ON s.projectId = p.id
		WHERE p.userId = ?
		GROUP BY p.id`,
		[userId],
	);
	return rows.map((r) => createProject(r));
}

export function findById(id: number) {
	return db.findBy('project', 'id', id, createProject) as Promise<Project>;
}

export async function findByIdOrSlug(idOrSlug: number | string) {
	let project;
	if (Number(idOrSlug) > 0) {
		project = await findById(Number(idOrSlug));
	}
	if (!project) {
		// we got slug OR no match for ID
		project = await findBySlug(String(idOrSlug));
	}
	return project;
}

export function findBySlug(slug: string) {
	return db.findBy('project', 'slug', slug, createProject) as Promise<Project>;
}

export function incrementViewsById(id: number) {
	return db.query('UPDATE project SET views = views + 1 WHERE id = ?', [id]);
}

export function update(project: Project) {
	return db.update('project', project, createProject);
}

export function updateLastSent(id: number) {
	return db.query('UPDATE project SET lastSent = ? WHERE id = ?', [Date.now(), id]);
}

export async function attemptToUnsubscribe(id: number, token: string) {
	const sql = `
		UPDATE project
		SET subscribe = "N"
		WHERE id = ?
		AND unsubscribeToken = ?`;
	const r = await db.query(sql, [id, token]);
	return !!(r as any).affectedRows;
}

export type NotificationData = {
	id: number;
	lang: string;
	title: string;
	unsubscribeToken: string;
	email: string;
	name: string;
	submissions: number;
	newSubmissions: number;
};

export function dataForDailyNotifications() {
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
	return db.query(sql) as Promise<NotificationData[]>;
}

/**
 * @param {Number} debounceMins Only return projects where last submission is older than X minutes
 * @returns {Promise<NotificationData[]>}
 */
export function dataForEventBasedNotifications(debounceMins: number) {
	const sql = `
		SELECT
			u.email,
			u.name,
			p.id,
			p.lang,
			p.lastSent,
			p.title,
			p.unsubscribeToken,
			MAX(s.timestamp) lastSubmission,
			SUM(CASE
				WHEN s.timestamp > p.lastSent
				THEN 1
				ELSE 0
			END) newSubmissions,
			COUNT(s.id) submissions
		FROM project p
		INNER JOIN submission s ON s.projectId = p.id
		INNER JOIN user u ON u.id = p.userId
		WHERE subscribe = 'E'
		GROUP BY p.id
		HAVING newSubmissions > 0
		AND (
			lastSubmission/1000 < UNIX_TIMESTAMP(NOW()) - 60 * ?
			OR p.lastSent/1000 < UNIX_TIMESTAMP(NOW()) - 60 * ?
		);
	`;
	return db.query(sql, [debounceMins, debounceMins]) as Promise<NotificationData[]>;
}
