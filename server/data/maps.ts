import * as db from '~/server/utils/database';

export type Map = {
	id: number;
	userId: number;
	title: string;
	features: string;
	featureCount?: number;
};

export function createMap(data: any): Map {
	return {
		id: data.id,
		userId: data.userId,
		title: data.title,
		features: data.features,
	};
}

export function create(map: Map) {
	return db.create('map', map, createMap);
}

export function del(id: number) {
	return db.del('map', id);
}

export function findAll() {
	return db.findAll('map', createMap) as Promise<Map[]>;
}

export function findAllByUserId(userId: number) {
	return db.findAllBy('map', 'userId', userId, createMap);
}

export async function findFiltered(
	filter: string,
	userId: number | undefined,
	page: number,
	pageSize: number,
): Promise<Map[]> {
	const offset = (page - 1) * pageSize;
	const like = `%${filter}%`;
	const id = parseInt(filter, 10) || 0;
	const userClause = userId !== undefined ? 'AND userId = ?' : '';
	const args: (string | number)[] = [like, id, ...(userId !== undefined ? [userId] : []), id];
	const rows = await db.query(
		`SELECT * FROM map WHERE (title LIKE ? OR id = ?) ${userClause} ORDER BY (id = ?) DESC, id DESC LIMIT ${pageSize} OFFSET ${offset}`,
		args,
	);
	return rows.map((r) => createMap(r));
}

export async function countFiltered(filter: string, userId?: number): Promise<number> {
	const like = `%${filter}%`;
	const id = parseInt(filter, 10) || 0;
	const userClause = userId !== undefined ? 'AND userId = ?' : '';
	const args: (string | number)[] = [like, id, ...(userId !== undefined ? [userId] : [])];
	const rows = await db.query(
		`SELECT COUNT(*) AS cnt FROM map WHERE (title LIKE ? OR id = ?) ${userClause}`,
		args,
	);
	return (rows[0] as any).cnt as number;
}

export function findById(id: number) {
	return db.findBy('map', 'id', id, createMap);
}

export function update(map: Map) {
	return db.update('map', map, createMap);
}
