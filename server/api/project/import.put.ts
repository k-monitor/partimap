import { z, zh } from 'h3-zod';
import StatusCodes from 'http-status-codes';
import * as pdb from '~/server/data/projects';
import * as sdb from '~/server/data/sheets';

export default defineEventHandler(async (event) => {
	const user = await ensureAdmin(event);

	const body = await zh.useValidatedBody(event, {
		project: z.object({
			lang: z.string().length(2),
			slug: z.string().nullable().optional(),
			title: z.string().min(1),
			description: z.string().nullable().optional(),
			privacyPolicy: z.string(),
			thanks: z.string().nullable().optional(),
			thanksUrl: z.string().url().nullable().optional(),
			thanksSocial: z.string().nullable().optional(),
			quizMode: z.number().int().min(0),
		}),
		sheets: z.array(
			z.object({
				ord: z.number().int().min(0),
				title: z.string().min(1),
				description: z.string().nullable().optional(),
				survey: z.string().nullable().optional(),
				features: z.string().nullable().optional(),
				interactions: z.string().nullable().optional(),
				descriptionLabel: z.string().nullable().optional(),
			}),
		),
	});

	const project = pdb.createProject(body.project);
	project.userId = user.id;
	if (project.slug && (await pdb.findBySlug(project.slug))) {
		project.slug = await generateValidSlug(project.title);
	}

	const id = await pdb.create(project);
	if (!id) throw createError({ statusCode: StatusCodes.METHOD_FAILURE });

	for (const exportedSheet of body.sheets) {
		const sheet = sdb.createSheet(exportedSheet);
		sheet.projectId = id;
		await sdb.create(sheet);
	}
});
