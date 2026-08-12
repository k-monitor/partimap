import type mysql from 'mysql2/promise';
import * as db from '~/server/utils/database';

export type PDLogEntry = {
	timestamp: number;
	actorId: number;
	subjectId: number;
	field: 'fullName' | 'address' | 'birthPlace' | 'birthDate';
	operation: 'update' | 'first_write' | 'reveal';
};

export function createQuery(entry: PDLogEntry) {
	return db.createQuery('pd_log', entry, (data) => data);
}

export async function findBySubjectId(tx: mysql.Connection, subjectId: number) {
	const [rows] = await tx.execute(
		'SELECT * FROM pd_log WHERE subjectId = ? ORDER BY timestamp ASC',
		[subjectId],
	);
	return rows as PDLogEntry[];
}
