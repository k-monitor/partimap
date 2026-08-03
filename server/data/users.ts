import * as db from '~/server/utils/database';
import * as pdb from '~/server/data/projects';

// FIXME separate types for create, patch, retrieve, add encryption/decryption here

export type User = {
	id: number;
	active: boolean;
	email: string;
	password: string;
	name: string;
	color: string | null;
	logo: string | null;
	website: string;
	registered: number;
	lastLogin: number;
	token: string | null;
	tokenExpires: number | null;
	isAdmin: boolean;
	consent25Aug: number;
	gdprBlockNoticeSent: number;
};

export type PublicUser = Pick<User, 'id' | 'email' | 'name' | 'isAdmin'>;

export function createUser(data: any): User {
	return {
		id: data.id,
		active: data.active,
		email: data.email,
		password: data.password,
		name: data.name,
		color: data.color,
		logo: data.logo,
		website: data.website,
		registered: data.registered || 0,
		lastLogin: data.lastLogin || 0,
		isAdmin: data.isAdmin || false,
		token: data.token,
		tokenExpires: data.tokenExpires,
		consent25Aug: data.consent25Aug || 0,
		gdprBlockNoticeSent: data.gdprBlockNoticeSent || 0,
	};
}

export function create(user: User) {
	return db.create('user', user, createUser);
}

export async function del(id: number) {
	const delProjectQueries = [];
	const projects = await pdb.findAllByUserId(id);
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

export function findAll() {
	return db.findAll('user', createUser) as Promise<User[]>;
}

export function findByEmail(email: string) {
	return db.findBy('user', 'email', email, createUser) as Promise<User>;
}

export function findById(id: number) {
	return db.findBy('user', 'id', id, createUser) as Promise<User | null>;
}

export function findByToken(token: string) {
	return db.findBy('user', 'token', token, createUser) as Promise<User>;
}

export function update(user: User) {
	return db.update('user', user, createUser);
}

export function updateLastLogin(id: number) {
	return query('UPDATE user SET lastLogin = ? WHERE id = ?', [Date.now(), id]);
}

export function updateGdprBlockNoticeSent(id: number) {
	return query('UPDATE user SET gdprBlockNoticeSent = ? WHERE id = ?', [Date.now(), id]);
}

export type GdprBlockNoticeData = {
	id: number;
	email: string;
	name: string;
	lang: string;
	projects: { id: number; title: string }[];
};

export function dataForGdprBlockNotices() {
	const sql = `
		SELECT
			u.id,
			u.email,
			u.name,
			(
				SELECT lang FROM project WHERE userId = u.id
				GROUP BY lang
				ORDER BY COUNT(1) DESC, MAX(id) DESC LIMIT 1
			) lang,
			JSON_ARRAYAGG(JSON_OBJECT('id', p.id, 'title', p.title)) AS projects
		FROM user u
		INNER JOIN project p ON p.userId = u.id
		WHERE u.gdprBlockNoticeSent = 0 AND
		(
			p.purposeOfDataCollection IS NULL
			OR CHAR_LENGTH(TRIM(REGEXP_REPLACE(p.purposeOfDataCollection, '<[^>]*>', ''))) = 0
			OR CHAR_LENGTH(TRIM(REGEXP_REPLACE(p.privacyPolicy, '<[^>]*>', ''))) = 0
		)
		GROUP BY u.id
		ORDER BY u.lastLogin DESC
		LIMIT 5;
	`;
	return db.query(sql) as Promise<GdprBlockNoticeData[]>;
}
