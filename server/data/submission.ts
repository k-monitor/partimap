import * as db from '~/server/utils/database';
import { createRating, type Rating } from '~/server/data/ratings';
import { createSurveyAnswer, type SurveyAnswer } from '~/server/data/surveyAnswers';
import { createSubmittedFeatures, type SubmittedFeatures } from '~/server/data/submittedFeatures';

export type Submission = {
	id: number;
	projectId: number;
	timestamp: number;
	ip: string;
	ua: string;
};

export function createSubmission(data: any): Submission {
	return {
		id: data.id,
		projectId: data.projectId,
		timestamp: data.timestamp,
		ip: data.ip,
		ua: data.ua,
	};
}

export async function create(
	submission: Submission,
	ratings: Rating[],
	answers: SurveyAnswer[],
	features: SubmittedFeatures[],
) {
	let submissionId = -1;
	await db.inTransaction(async (connection) => {
		const cq = db.createQuery('submission', submission, createSubmission);
		const [rows] = await connection.execute(cq.statement, cq.args);
		const insertId: number = (rows as any).insertId;
		if (!insertId || insertId < 0) {
			throw new Error(`Invalid insertId: ${insertId}`);
		}
		submissionId = insertId;

		const queries = [
			...ratings.map((e) => {
				e.submissionId = submissionId;
				return db.createQuery('rating', e, createRating);
			}),
			...answers.map((e) => {
				e.submissionId = submissionId;
				return db.createQuery('survey_answer', e, createSurveyAnswer);
			}),
			...features.map((e) => {
				e.submissionId = submissionId;
				return db.createQuery('submitted_features', e, createSubmittedFeatures);
			}),
		];
		await db.runQueries(connection, queries);
	});
	return submissionId;
}

export function findById(id: number) {
	return db.findBy('submission', 'id', id, createSubmission) as Promise<Submission>;
}

export async function findByProjectId(projectId: number) {
	const rows = await db.query('SELECT * FROM submission WHERE projectId = ?', [projectId]);
	return rows.map((r) => createSubmission(r));
}
