import * as db from '~/server/utils/database';
import * as pdb from '~/server/data/projects';

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
	eFullName: string | null;
	eAddress: string | null;
	eBirthPlace: string | null;
	eBirthDate: string | null;
};

export type PublicUser = Pick<User, 'id' | 'email' | 'isAdmin'>;

export function createUser(data: Partial<User>): User {
	return {
		id: data.id || 0,
		active: data.active || false,
		email: data.email || '',
		password: data.password || '',
		name: data.name || '',
		color: data.color || null,
		logo: data.logo || null,
		website: data.website || '',
		registered: data.registered || 0,
		lastLogin: data.lastLogin || 0,
		isAdmin: data.isAdmin || false,
		token: data.token || null,
		tokenExpires: data.tokenExpires || null,
		consent25Aug: data.consent25Aug || 0,
		gdprBlockNoticeSent: data.gdprBlockNoticeSent || 0,
		eFullName: data.eFullName || null,
		eAddress: data.eAddress || null,
		eBirthDate: data.eBirthDate || null,
		eBirthPlace: data.eBirthPlace || null,
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
	return db.query('UPDATE user SET lastLogin = ? WHERE id = ?', [Date.now(), id]);
}

export function updateGdprBlockNoticeSent(id: number) {
	return db.query('UPDATE user SET gdprBlockNoticeSent = ? WHERE id = ?', [Date.now(), id]);
}

export type GdprBlockNoticeData = {
	id: number;
	email: string;
	name: string;
	eFullName: string | null;
	lang: string;
	projects: { id: number; title: string }[];
};

export function dataForGdprBlockNotices() {
	const sql = `
		SELECT
			u.id,
			u.email,
			u.name,
			u.eFullName,
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
