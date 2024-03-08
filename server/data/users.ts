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
	token: string;
	tokenExpires: number;
	isAdmin: boolean;
};

export type PublicUser = Pick<User, 'id' | 'name' | 'isAdmin'>;

export async function findByEmail(email: string): Promise<User | null> {
	const rows = await query('SELECT * FROM user WHERE email = ?', [email]);
	return (rows[0] as User) || null;
}

export async function findById(id: number) {
	const rows = await query('SELECT * FROM user WHERE id = ?', [id]);
	return (rows[0] as User) || null;
}

export function updateLastLogin(id: number) {
	return query('UPDATE user SET lastLogin = ? WHERE id = ?', [Date.now(), id]);
}
