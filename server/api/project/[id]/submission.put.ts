import StatusCodes from 'http-status-codes';
import { z } from 'zod';
import * as pdb from '~/server/data/projects';
import * as sdb from '~/server/data/sheets';
import * as smdb from '~/server/data/submissions';

const paramsSchema = z.object({
	id: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
	await validateCaptcha(event);

	const { id } = await getValidatedRouterParams(event, paramsSchema.parse);
	const project = await pdb.findById(id);
	if (!project) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	/*
		{
			sheetID: {
				answers: {
					questionID: answer.toString(),
					...
				},
				features: [],
				ratings: {
					featureID: {
						value: number,
						question: string,
						answer: string,
						pros: string,
						cons: string,
					},
					...
				}
			},
			...
		}
	*/

	const ip = getHeader(event, 'x-forwarded-for') || event.node.req.socket.remoteAddress;
	const ua = getHeader(event, 'user-agent');

	const projectSheetIds = (await sdb.findAllByProjectId(project.id)).map((s) => s.id);

	const body = await readBody<any>(event);
	const submittedSheetIds = Object.keys(body).filter((id) =>
		projectSheetIds.includes(Number(id)),
	);
	if (!submittedSheetIds.length) throw createError({ statusCode: StatusCodes.BAD_REQUEST });

	// TODO validate body shape with Zod
	// TODO validate answers: filter for existing questionIDs in that same sheet
	// TODO validate ratings: filter for existing featureIDs in that same sheet
	// TODO send BAD_REQUEST if no answer, no feature and no rating present

	const submission = {
		projectId: project.id,
		timestamp: new Date().getTime(),
		ip,
		ua,
	};
	const ratings = [];
	const surveyAnswers = [];
	const submittedFeatures = [];

	for (const sheetId of submittedSheetIds) {
		const s = body[sheetId];
		if (s.answers) {
			for (const questionId in s.answers) {
				surveyAnswers.push({
					sheetId: Number(sheetId),
					questionId: Number(questionId),
					answer: s.answers[questionId],
				});
			}
		}
		if (s.features) {
			submittedFeatures.push({
				sheetId: Number(sheetId),
				features: s.features,
			});
		}
		if (s.ratings) {
			for (const fid in s.ratings) {
				const featureId = Number(fid);
				if (!featureId) continue;
				const ratingObj = s.ratings[featureId];
				ratings.push({
					sheetId: Number(sheetId),
					featureId,
					rating: ratingObj.value,
					question: ratingObj.question,
					answer: ratingObj.answer,
					pros: ratingObj.pros,
					cons: ratingObj.cons,
				});
			}
		}
	}
	const submissionId = await smdb.create(submission, ratings, surveyAnswers, submittedFeatures);
	return { submissionId };
});
