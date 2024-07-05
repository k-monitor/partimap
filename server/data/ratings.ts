import * as db from '~/server/utils/database';

export type Rating = {
	id: number;
	submissionId: number;
	sheetId: number;
	featureId: number;
	rating: number;
	question: string;
	answer: string;
	pros: string;
	cons: string;
};

export type AggregatedRating = {
	id: number;
	average: number;
	count: number;
	dislikeCount: number;
	featureId: number;
	likeCount: number;
	sum: number;
};

export function createRating(data: any): Rating {
	return {
		id: data.id,
		submissionId: data.submissionId,
		sheetId: data.sheetId,
		featureId: data.featureId,
		rating: data.rating,
		question: data.question,
		answer: data.answer,
		pros: data.pros,
		cons: data.cons,
	};
}

export function createAggregatedRating(data: any): AggregatedRating {
	return {
		id: data.id,
		average: parseFloat(data.average),
		count: parseInt(data.count, 10),
		dislikeCount: parseInt(data.dislikeCount, 10),
		featureId: data.featureId,
		likeCount: parseInt(data.likeCount, 10),
		sum: parseInt(data.sum, 10),
		// we need the parseX calls because MySQL client returns strings
	};
}

export async function aggregateBySheetId(sheetId: number) {
	const sql = `
		SELECT
			featureId,
			COUNT(rating) count,
			SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) likeCount,
			SUM(CASE WHEN rating = -1 THEN 1 ELSE 0 END) dislikeCount,
			SUM(rating) sum,
			AVG(rating) average
		FROM rating
		WHERE sheetID = ?
		GROUP BY featureID;`;
	const rows = await db.query(sql, [sheetId]);
	return rows.map((r) => createAggregatedRating(r)) as AggregatedRating[];
}

export async function aggregateBySheetIdToDict(sheetId: number) {
	const ratings = await aggregateBySheetId(sheetId);
	const result: Record<number, AggregatedRating> = {};
	for (const rating of ratings) {
		result[rating.featureId] = rating;
	}
	return result;
}

export async function findAllByProjectId(projectId: number) {
	const rows = await db.query(
		'SELECT r.* FROM rating r INNER JOIN sheet s ON s.id = r.sheetId AND s.projectId = ?',
		[projectId],
	);
	return rows.map((r) => createRating(r)) as Rating[];
}
