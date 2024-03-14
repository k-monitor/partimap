import * as db from '../utils/database';

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
};

export function createProject(data: any) {
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
	};
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

export function findById(id: number) {
	return db.findBy('project', 'id', id, createProject) as Promise<Project>;
}

export async function findByUserId(userId: number) {
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
