import type mysql from 'mysql2/promise';
import * as db from '~/server/utils/database';

export const PD_FIELDS = ['fullName', 'address', 'birthPlace', 'birthDate'] as const;
export type PDField = (typeof PD_FIELDS)[number];
export type PDOperation = 'update' | 'first_write' | 'reveal';

export type PDLogEntry = {
	timestamp: number;
	actorId: number;
	subjectId: number;
	field: PDField;
	operation: PDOperation;
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
