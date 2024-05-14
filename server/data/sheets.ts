import * as db from '~/server/utils/database';
import type { AggregatedRating } from '~/server/data/ratings';
import type { AggregatedAnswers } from '~/server/data/surveyAnswers';

export type Sheet = {
	id: number;
	projectId: number;
	ord: number; // index within project
	title: string;
	description: string;
	image: string | null;
	survey: string; // JSON
	features: string;
	interactions: string; // JSON
	descriptionLabel: string; // legacy

	// only in some API responses
	answers?: AggregatedAnswers[];
	ratings?: Record<number, AggregatedRating>;

	// only on some UI parts
	featureCount?: number;
	submittedFeatureCount?: number;
};

export function createSheet(data: any): Sheet {
	return {
		id: data.id,
		projectId: data.projectId,
		ord: data.ord,
		title: data.title,
		description: data.description,
		image: data.image,
		survey: data.survey,
		features: data.features,
		interactions: data.interactions,
		descriptionLabel: data.descriptionLabel,
	};
}

export async function create(sheet: Partial<Sheet> & Pick<Sheet, 'projectId'>) {
	sheet.ord = 9999;
	const id = await db.create('sheet', sheet, createSheet);
	await reorderSheets(sheet.projectId);
	return id;
}

export async function del(id: number) {
	const sheet = await findById(id);
	await db.transaction([
		{
			statement: 'DELETE FROM sheet WHERE id = ?',
			args: [id],
		},
		{
			statement: 'DELETE FROM submitted_features WHERE sheetId = ?',
			args: [id],
		},
		{
			statement: 'DELETE FROM survey_answer WHERE sheetId = ?',
			args: [id],
		},
		{
			statement: 'DELETE FROM rating WHERE sheetId = ?',
			args: [id],
		},
	]);
	await reorderSheets(sheet.projectId);
}

export async function findAllByProjectId(projectId: number) {
	const rows = await db.query('SELECT * FROM sheet WHERE projectId = ? ORDER BY ord, id', [
		projectId,
	]);
	return rows.map(createSheet);
}

export function findById(id: number) {
	return db.findBy('sheet', 'id', id, createSheet);
}

export async function findByProjectIdAndOrder(projectId: number, ord: number) {
	const rows = await db.query('SELECT * FROM sheet WHERE projectId = ? AND ord = ?', [
		projectId,
		ord,
	]);
	return rows.map(createSheet)[0];
}

export async function update(sheet: Sheet) {
	const oldSheet = await findById(sheet.id);
	if (oldSheet.ord < sheet.ord) {
		// so we increase ord
		await db.query(
			'UPDATE sheet SET ord = ord - 1 WHERE projectId = ? AND ord BETWEEN ? AND ?',
			[sheet.projectId, oldSheet.ord + 1, sheet.ord],
		);
	} else if (oldSheet.ord > sheet.ord) {
		await db.query(
			'UPDATE sheet SET ord = ord + 1 WHERE projectId = ? AND ord BETWEEN ? AND ?',
			[sheet.projectId, sheet.ord, oldSheet.ord - 1],
		);
	}
	await db.update('sheet', sheet, createSheet);
	await reorderSheets(sheet.projectId);
}

async function reorderSheets(projectId: number) {
	const queries = [];
	const sheets = await findAllByProjectId(projectId);
	for (let i = 0; i < sheets.length; i++) {
		if (sheets[i].ord !== i) {
			queries.push({
				statement: 'UPDATE sheet SET ord = ? WHERE id = ?',
				args: [i, sheets[i].id],
			});
		}
	}
	return db.transaction(queries);
}
