import StatusCodes from 'http-status-codes';
import { z } from 'zod';
import * as pdb from '~/server/data/projects';
import * as sdb from '~/server/data/sheets';

const paramsSchema = z.object({
	id: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

	await ensureLoggedIn(event);

	const project: pdb.Project = await pdb.findById(id);
	if (!project) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	await ensureAdminOr(event, project.userId);

	const exportedProject: pdb.ExportableProjectDefinition = {
		lang: project.lang,
		slug: project.slug,
		title: project.title,
		description: project.description,
		privacyPolicy: project.privacyPolicy,
		thanks: project.thanks,
		thanksUrl: project.thanksUrl,
		thanksSocial: project.thanksSocial,
		quizMode: project.quizMode,
	};

	const sheets = await sdb.findAllByProjectId(project.id);
	const exportedSheets: sdb.ExportableSheetDefinition[] = sheets.map((s) => ({
		ord: s.ord,
		title: s.title,
		description: s.description,
		survey: s.survey,
		features: s.features,
		interactions: s.interactions,
		descriptionLabel: s.descriptionLabel,
	}));

	return {
		project: exportedProject,
		sheets: exportedSheets,
	};
});
