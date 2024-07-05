import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import StatusCodes from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { getClientIp } from 'request-ip';
import { z } from 'zod';
import * as pdb from '~/server/data/projects';
import * as rdb from '~/server/data/ratings';
import * as sdb from '~/server/data/sheets';
import * as sadb from '~/server/data/surveyAnswers';
import * as udb from '~/server/data/users';
import { env } from '~~/env';
import { H3Event } from 'h3';
import { deserializeInteractions } from '~/utils/interactions';

const COOKIE_NAME = 'partimap.pat'; // pat = project access token :D
const JWT_SECRET = env.JWT_SECRET || crypto.randomBytes(64).toString('hex');

type JwtPayload = {
	projectId: number;
	visitId: number;
	ip: string;
};

const bodySchema = z.object({
	idOrSlug: z.string().min(1),
	password: z.string().min(1).optional(),
	visitId: z.number().min(1),
});
type Body = z.infer<typeof bodySchema>;

export default defineEventHandler(async (event) => {
	const body = await readValidatedBody(event, bodySchema.parse);

	const project = await pdb.findByIdOrSlug(body.idOrSlug);
	if (!project) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	const user = await udb.findById(project.userId);
	if (!user) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	if (project.password && body.password) {
		await validateCaptcha(event);
	}

	const accessGranted = isAccessGranted(event, body, project);

	if (!accessGranted) {
		// token is missing / invalid / expired
		setResponseStatus(event, StatusCodes.UNAUTHORIZED);
		return {
			title: project.title,
			description: project.description,
			image: project.image,
			slug: project.slug,
		};
	}

	project.sheets = await sdb.findAllByProjectId(project.id);

	await addResultsToProject(project);

	project.user = {
		color: user.color,
		logo: user.logo,
		website: user.website,
	};
	return hideSecrets(project);
});

function isAccessGranted(event: H3Event, body: Body, project: pdb.Project) {
	const ip = getClientIp(event.node.req) || '';

	// projects without password can be accessed freely:
	if (!project.password) return true;

	// logged in admin or project owner can bypass password protection:
	const user = event.context.user;
	if (user?.isAdmin || user?.id === project.userId) return true;

	// check received password if any
	if (body.password && bcrypt.compareSync(body.password, project.password)) {
		const data: JwtPayload = {
			projectId: project.id,
			visitId: body.visitId,
			ip,
		};
		const expSeconds = 60 * 60; // 1 hour
		const token = jwt.sign(data, JWT_SECRET, {
			expiresIn: `${expSeconds}s`,
		});
		setCookie(event, COOKIE_NAME, token, {
			expires: new Date(Date.now() + 1000 * expSeconds),
			httpOnly: true,
			path: '/',
			sameSite: 'lax',
			secure: !process.dev,
		});
		return true;
	}

	// if no password received, verify token
	const token = getCookie(event, COOKIE_NAME);
	if (!token) return false;

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
		if (
			decoded.projectId === project.id &&
			decoded.visitId === body.visitId &&
			decoded.ip === ip
		) {
			// token is valid
			return true;
		}
	} catch (error) {
		// token is invalid/expired
	}

	return false;
}

function doesSheetNeedRatingResults(sheet: sdb.Sheet) {
	try {
		const interactions = deserializeInteractions(sheet);
		const enabled = interactions.enabled || [];
		return enabled.includes('RatingResults');
	} catch {
		return false;
	}
}

function doesSheetNeedSurveyResults(sheet: sdb.Sheet) {
	try {
		const survey = JSON.parse(sheet.survey) as sadb.Survey;
		const qnr = survey.questions.filter((q: sadb.Question) => q.showResult).length;
		return survey.showResults || qnr > 0;
	} catch {
		return false;
	}
}

async function addResultsToProject(project: pdb.Project) {
	project.sheets?.forEach((s) => {
		s.answers = [];
		s.ratings = {};
	});

	try {
		const answers = await sadb.aggregateByProjectId(project.id);
		project.sheets?.filter(doesSheetNeedSurveyResults).forEach((s) => {
			s.answers = answers.filter((a) => a.sheetId === s.id);
		});
	} catch (error) {
		console.error(error);
	}

	try {
		const promises = project.sheets?.filter(doesSheetNeedRatingResults).map(async (s) => {
			const dict = await rdb.aggregateBySheetIdToDict(s.id);
			s.ratings = dict;
		});
		if (promises) await Promise.all(promises);
	} catch (error) {
		console.error(error);
	}
}
