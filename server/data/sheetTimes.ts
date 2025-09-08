import * as db from '~/server/utils/database';

export type SheetTime = {
	submissionId: number;
	sheetId: number;
	spentTimeMs: number;
};

export function createSheetTime(data: any): SheetTime {
	return {
		submissionId: data.submissionId,
		sheetId: data.sheetId,
		spentTimeMs: data.spentTimeMs,
	};
}

export async function findSheetTimes(sheetIds: number[]): Promise<SheetTime[]> {
	const placeholders = sheetIds.map(() => '?').join(',');
	const rows = await db.query(
		`SELECT * FROM sheet_time WHERE sheetId IN (${placeholders})`,
		sheetIds,
	);
	return rows.map((r) => createSheetTime(r));
}
