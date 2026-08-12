import * as db from '~/server/utils/database';

export type PDLogEntry = {
	timestamp: number;
	actorId: number;
	subjectId: number;
	field: string;
	operation: 'update' | 'first_write';
};

export function createQuery(entry: PDLogEntry) {
	return db.createQuery('pd_log', entry, (data) => data);
}

export function findBySubjectId(subjectId: number) {
	return db.findBy('pd_log', 'subjectId', subjectId, (data) => data as PDLogEntry) as Promise<
		PDLogEntry[]
	>;
}
