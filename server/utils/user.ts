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

export async function findUserByEmail(email: string): Promise<User | null> {
	const rows = await query('SELECT * FROM user WHERE email = ?', [email]);
	return (rows[0] as User) || null;
}

export function updateUserLastLogin(id: number) {
	return query('UPDATE user SET lastLogin = ? WHERE id = ?', [Date.now(), id]);
}
