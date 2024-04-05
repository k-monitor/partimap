import * as db from '~/server/utils/database';

export type SubmittedFeatures = {
	id: number;
	submissionId: number;
	sheetId: number;
	features: string;
};

export function createSubmittedFeatures(data: any): SubmittedFeatures {
	return {
		id: data.id,
		submissionId: data.submissionId,
		sheetId: data.sheetId,
		features: data.features,
	};
}

export async function findAllByProjectId(projectId: number) {
	const rows = await db.query(
		`SELECT f.*
		FROM submitted_features f
		INNER JOIN sheet s
		ON s.id = f.sheetId
		AND s.projectId = ?`,
		[projectId],
	);
	return rows.map((r) => createSubmittedFeatures(r));
}

export async function findAllBySheetId(sheetId: number) {
	const rows = await db.query('SELECT * FROM submitted_features WHERE sheetId = ?', [sheetId]);
	return rows.map((r) => createSubmittedFeatures(r));
}
