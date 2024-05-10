import * as db from '~/server/utils/database';
import * as sdb from '~/server/data/sheets';
import { OTHER_ANSWER, OTHER_PREFIX } from '~/utils/constants';

export type SurveyAnswer = {
	id: number;
	submissionId: number;
	sheetId: number;
	questionId: number; // TODO varchar in db, but only numbers really
	answer: string;
};

export function createSurveyAnswer(data: any): SurveyAnswer {
	return {
		id: data.id,
		submissionId: data.submissionId,
		sheetId: data.sheetId,
		questionId: data.questionId,
		answer: data.answer,
	};
}

export type Condition = [[number, string?], string];

export type Question = {
	id: number;
	label: string;
	max?: number;
	options?: string[];
	required?: boolean;
	rows?: string[];
	showIf?: Condition[];
	showResult: boolean;
	type: string;
};

export type Survey = {
	questions: Question[];
	showResults?: boolean;
};

export type AggregatedAnswers = {
	questionId: string; // yes, it's string here, see matrix questions
	question: string;
	sheetId: number;
	type: string;
	average?: number;
	count: number;
	options?: {
		answer: string;
		average?: number;
		count?: number;
	}[];
};

export async function aggregateByProjectId(projectId: number) {
	const questions: (Question & { sheetId: number })[] = [];
	const sheets = await sdb.findAllByProjectId(projectId);
	for (const s of sheets) {
		const survey = JSON.parse(s.survey || '{}') as Survey;
		const qs = (survey.questions || [])
			.filter((q) => survey.showResults || q.showResult)
			.map((q) => ({ ...q, sheetId: s.id }));
		questions.push(...qs);
	}

	if (!questions.length) return [];

	const averagesByQuestion = (
		await db.query(
			`SELECT
				questionId,
				AVG(answer) average,
				COUNT(answer) count
			FROM survey_answer a
			INNER JOIN sheet s ON s.id = a.sheetId AND s.projectId = ?
			GROUP BY questionId`,
			[projectId],
		)
	).map((row) => ({
		questionId: parseInt(row.questionId, 10),
		average: parseFloat(row.average),
		count: parseInt(row.count, 10),
	}));

	const countsByAnswer = (
		await db.query(
			`SELECT
				questionId, answer,
				COUNT(answer) count
			FROM survey_answer a
			INNER JOIN sheet s ON s.id = a.sheetId AND s.projectId = ?
			GROUP BY questionId, answer`,
			[projectId],
		)
	).map((row) => ({
		questionId: row.questionId,
		answer: row.answer,
		count: parseInt(row.count, 10),
	}));

	async function getAnswersByQuestion(questionPredicate: (q: Question) => boolean) {
		const answersByQuestion: Map<number, string[]> = new Map();
		const filteredQuestions = questions.filter(questionPredicate);
		await Promise.all(
			filteredQuestions.map(async (q) => {
				const answers = (await db.query(
					`SELECT answer FROM survey_answer a
					INNER JOIN sheet s ON s.id = a.sheetId AND s.projectId = ?
					AND a.questionId = ?`,
					[projectId, q.id],
				)) as { answer: string }[];
				answersByQuestion.set(
					q.id,
					answers.map((a) => a.answer),
				);
			}),
		);
		return answersByQuestion;
	}

	const distAnswersByQuestion = await getAnswersByQuestion((q) => q.type === 'distributeUnits');
	const matrixAnswersByQuestion = await getAnswersByQuestion((q) => q.type.includes('Matrix'));

	const results: AggregatedAnswers[] = [];
	for (const q of questions) {
		if (q.type === 'text') continue;

		if (q.type === 'distributeUnits') {
			const sums: Map<string, number> = new Map();
			const counts: Map<string, number> = new Map();
			const answers: Record<string, any>[] = (distAnswersByQuestion.get(q.id) || [])
				.map((a) => {
					try {
						return JSON.parse(a);
					} catch {
						return false;
					}
				})
				.filter((a) => !!a);
			answers.forEach((a) => {
				Object.entries(a).forEach(([key, value]) => {
					if (!(q.options || []).includes(key)) return;
					sums.set(key, (sums.get(key) || 0) + value); // value is number in this question type
					counts.set(key, (counts.get(key) || 0) + 1);
				});
			});

			const result: AggregatedAnswers = {
				questionId: `${q.id}`,
				question: `${q.label}`,
				sheetId: q.sheetId,
				type: q.type,
				count: answers.length,
			};
			result.options = (q.options || [])
				.filter((o) => counts.get(o))
				.map((o) => ({
					answer: o,
					average: Math.round((10 * (sums.get(o) || 0)) / counts!.get(o)!) / 10,
				}));
			results.push(result);
			continue;
		}

		if (q.type.includes('Matrix')) {
			const answers = (matrixAnswersByQuestion.get(q.id) || [])
				.map((a) => {
					try {
						return JSON.parse(a);
					} catch {
						return false;
					}
				})
				.filter((a) => !!a);
			if (!answers || !answers.length) continue;

			(q.rows || []).forEach((row, i) => {
				let count = 0;
				const opts: Record<string, number> = {};
				answers
					.map((a) => a[row])
					.filter((a) => !!a)
					.forEach((a) => {
						count++;
						a = Array.isArray(a) ? a : [a];
						a.forEach((col: string) => {
							opts[col] = (opts[col] || 0) + 1;
						});
					});
				const result = {
					questionId: `${q.id}/${i}`,
					question: `${q.label} [${row}]`,
					sheetId: q.sheetId,
					type: q.type,
					count,
					options: Object.entries(opts).map(([answer, count]) => ({
						answer,
						count,
					})),
				};
				results.push(result);
			});
			continue;
		}

		const abq = averagesByQuestion.filter((e) => Number(e.questionId) === q.id)[0];
		const average = abq?.average || 0;
		const count = abq?.count || 0;
		if (count < 1) {
			continue;
		}

		const result: AggregatedAnswers = {
			questionId: String(q.id),
			question: q.label,
			sheetId: q.sheetId,
			type: q.type,
			average,
			count,
		};
		if (q.type === 'checkbox') {
			const opts: Record<string, number> = {};
			countsByAnswer
				.filter((e) => Number(e.questionId) === q.id)
				.forEach((e) => {
					JSON.parse(e.answer).forEach((o: string) => {
						if (o.startsWith(OTHER_PREFIX)) {
							o = OTHER_ANSWER;
						}
						opts[o] = (opts[o] || 0) + 1;
					});
				});
			result.options = Object.entries(opts).map(([answer, count]) => ({
				answer,
				count,
			}));
		} else {
			const opts: Record<string, number> = {};
			countsByAnswer
				.filter((e) => Number(e.questionId) === q.id)
				.map((e) => {
					if (`${e.answer}`.startsWith(OTHER_PREFIX)) {
						e.answer = OTHER_ANSWER;
					}
					return e;
				})
				.forEach((e) => {
					opts[e.answer] = (opts[e.answer] || 0) + e.count;
				});
			result.options = Object.entries(opts).map(([answer, count]) => ({
				answer,
				count,
			}));
			if ('number|range'.includes(q.type) && result.options.length > 10) {
				continue;
			}
		}

		results.push(result);
	}
	return results;
}

export async function findAllByProjectId(projectId: number) {
	const rows = await db.query(
		'SELECT a.* FROM survey_answer a INNER JOIN sheet s ON s.id = a.sheetId AND s.projectId = ?',
		[projectId],
	);
	return rows.map((r) => createSurveyAnswer(r));
}
