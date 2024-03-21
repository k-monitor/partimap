import * as db from '~/server/utils/database';

export type Map = {
	id: number;
	userId: number;
	title: string;
	features: string;
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

export function findById(id: number) {
	return db.findBy('map', 'id', id, createMap);
}

export function update(map: Map) {
	return db.update('map', map, createMap);
}
