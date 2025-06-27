import type { Feature as GeoJsonFeature } from 'geojson';
import StatusCodes from 'http-status-codes';
import { z } from 'zod';
import * as pdb from '~/server/data/projects';
import * as sdb from '~/server/data/sheets';
import * as sfdb from '~/server/data/submittedFeatures';
import type { Question, SurveyAnswer } from '~/server/data/surveyAnswers';
import { findAllBySheetIdAndQuestionIds } from '~/server/data/surveyAnswers';
import { parseSurvey } from '~/utils/questionUtil';

const paramsSchema = z.object({
	id: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

	await ensureLoggedIn(event);

	const sheet = await sdb.findById(id);
	if (!sheet) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	const project = await pdb.findById(sheet.projectId);
	if (!project) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	await ensureAdminOr(event, project.userId);

	const sfs = await sfdb.findAllBySheetId(sheet.id);
	const featuresBySubmissionId: Record<number, GeoJsonFeature[]> = {};

	for (const sf of sfs) {
		const features = (safeParseJSONArray(sf.features) || []).filter((f) => !!f.id);
		if (features.length > 0) {
			featuresBySubmissionId[sf.submissionId] = features;
		}
	}

	const sheets = await sdb.findAllByProjectId(project.id);
	for (const s of sheets) {
		const survey = parseSurvey(s.survey);
		if (!survey || !survey.questions) continue;

		const questions = survey.questions.filter((q) => q.addToFeatures);
		if (!questions.length) continue;

		const answers = await findAllBySheetIdAndQuestionIds(
			s.id,
			questions.map((q) => q.id),
		);
		for (const a of answers) {
			const q = questions.find((q) => String(q.id) === String(a.questionId));
			if (!q) continue;
			const features = featuresBySubmissionId[a.submissionId] || [];
			for (const f of features) {
				injectSurveyAnswerIntoFeature(f, q, a);
			}
		}
	}

	return Object.values(featuresBySubmissionId).flat();
});

function injectSurveyAnswerIntoFeature(f: GeoJsonFeature, q: Question, a: SurveyAnswer) {
	const ans: number | string | string[] | Record<string, string> =
		safeParseJSON(a.answer) || a.answer;
	const str = (v: number | string | string[]) =>
		Array.isArray(v) ? v.join(', ') : String(v) || '';
	if (typeof ans === 'object' && !Array.isArray(ans)) {
		// answer is {...}, so a matrix -> injecting rows separately
		Object.keys(ans).forEach((k: keyof typeof ans, i) => {
			const questionId = `${q.id}_${i}`;
			const questionLabel = `${q.label} [${k}]`;
			const answer = str(ans[k]);
			injectAnswerIntoFeature(f, questionId, questionLabel, answer);
		});
	} else {
		const questionId = String(a.questionId);
		const questionLabel = q.label;
		const answer = str(ans);
		injectAnswerIntoFeature(f, questionId, questionLabel, answer);
	}
}

function injectAnswerIntoFeature(
	f: GeoJsonFeature,
	questionId: string,
	questionLabel: string,
	answer: string,
) {
	f.properties = f.properties || {};
	f.properties[`partimapQuestion_${questionId}`] = questionLabel;
	f.properties[`partimapQuestion_${questionId}_ans`] = answer;
}
