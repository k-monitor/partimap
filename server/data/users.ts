import * as db from '../utils/database';
import * as pdb from './projects';

export type User = {
	id: number;
	active: boolean;
	email: string;
	password: string;
	name: string;
	color: string;
	logo: string;
	website: string;
	registered: number;
	lastLogin: number;
	token: string | null;
	tokenExpires: number | null;
	isAdmin: boolean;
};

export type PublicUser = Pick<User, 'id' | 'name' | 'isAdmin'>;

export function createUser(data: any): any {
	return {
		id: data.id,
		active: data.active,
		email: data.email,
		password: data.password,
		name: data.name,
		color: data.color,
		logo: data.logo,
		website: data.website,
		registered: data.registered || new Date().getTime(),
		lastLogin: data.lastLogin || 0,
		isAdmin: data.isAdmin || false,
		token: data.token,
		tokenExpires: data.tokenExpires,
	};
}

export function create(user: User) {
	return db.create('user', user, createUser);
}

export async function del(id: number) {
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

export function findAll() {
	return db.findAll('user', createUser) as Promise<User[]>;
}

export function findByEmail(email: string) {
	return db.findBy('user', 'email', email, createUser) as Promise<User>;
}

export function findById(id: number) {
	return db.findBy('user', 'id', id, createUser) as Promise<User>;
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
