const crypto = require('crypto');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const copydir = require('copy-dir');
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const rmrf = require('rimraf').sync;
const slugify = require('slugify');
const Project = require('../../model/project');
const { ensureLoggedIn, ensureAdminOr } = require('../auth/middlewares');
const { hidePasswordField } = require('../common/functions');
const i18n = require('../common/i18n');
const {
	acceptImage,
	resolveRecord,
	validateCaptcha,
} = require('../common/middlewares');
const { JWT_SECRET } = require('../conf');
const rdb = require('../rating/rating.db');
const sdb = require('../sheet/sheet.db');
const sadb = require('../surveyAnswer/surveyAnswer.db');
const udb = require('../user/user.db');
const pdb = require('./project.db');

router.patch(
	'/project',
	ensureLoggedIn,
	resolveRecord(req => req.body.id, pdb.findById, 'project'),
	ensureAdminOr(req => req.project.userId === req.user.id),
	async (req, res) => {
		const changes = req.body;
		if (!req.user.isAdmin) {
			delete changes.userId;
		}

		delete changes.password;
		if (changes.newPassword !== undefined) {
			changes.password = changes.newPassword
				? bcrypt.hashSync(changes.newPassword, 10)
				: null;
		}

		if (changes.slug === null || changes.slug === '') {
			// request removes custom slug, generate based on title
			changes.slug = await generateValidSlug(
				changes.title || req.project.title,
				req.project.id
			);
		} else if (changes.slug) {
			// request modifies slug, just validate
			changes.slug = await generateValidSlug(
				changes.slug,
				req.project.id
			);
		}

		if (changes.image === null || changes.image === '') {
			removeProjectImageFile(req.project);
		} else {
			delete changes.image;
		}

		if (!['N', 'E', 'D'].includes(changes.subscribe)) {
			changes.subscribe = 'N';
		}
		if (
			changes.subscribe !== 'N' &&
			changes.subscribe !== req.project.subscribe
		) {
			// it's been turned on now
			changes.unsubscribeToken = crypto.randomBytes(64).toString('hex');
			changes.lastSent = Date.now();
		}

		let project = new Project(Object.assign(req.project, changes));
		if (!project.title) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}
		await pdb.update(project);

		project = await pdb.findById(project.id);
		project.sheets = await sdb.findByProjectId(project.id);
		res.json(hidePasswordField(project));
	}
);

router.put('/project', ensureLoggedIn, async (req, res) => {
	delete req.body.image;
	let project = new Project(req.body);
	if (!project.title) {
		return res.sendStatus(StatusCodes.BAD_REQUEST);
	}
	if (!project.userId || !req.user.isAdmin) {
		project.userId = req.user.id;
	}
	if (project.password) {
		project.password = bcrypt.hashSync(project.password, 10);
	}
	project.slug = await generateValidSlug(project.slug || project.title);

	const projectId = await pdb.create(project);
	project = await pdb.findById(projectId);

	const title = i18n(project.lang).newProject.newSheetTitle;
	await sdb.create({ projectId, title });

	res.json(hidePasswordField(project));
});

function doesSheetNeedRatingResults(sheet) {
	try {
		const interactions = JSON.parse(sheet.interactions || '{}');
		const enabled = interactions.enabled || [];
		if (enabled.includes('RatingResults')) return true;
	} catch {}
	return false;
}

function doesSheetNeedSurveyResults(sheet) {
	try {
		const survey = JSON.parse(sheet.survey);
		const qnr = survey.questions.filter(q => q.showResult).length;
		return survey.showResults || qnr > 0;
	} catch {
		return false;
	}
}

async function addResultsToProject(project) {
	project.sheets.forEach(s => {
		s.answers = [];
		s.ratings = {};
	});

	try {
		const answers = await sadb.aggregateByProjectId(project.id);
		project.sheets.filter(doesSheetNeedSurveyResults).forEach(s => {
			s.answers = answers.filter(a => a.sheetId === s.id);
		});
	} catch (error) {
		console.error(error);
	}

	try {
		const promises = project.sheets
			.filter(doesSheetNeedRatingResults)
			.map(async s => {
				const dict = await rdb.aggregateBySheetIdToDict(s.id);
				s.ratings = dict;
			});
		await Promise.all(promises);
	} catch (error) {
		console.error(error);
	}
}

router.post(
	'/project/access',
	resolveRecord(req => req.body.projectId, pdb.findByIdOrSlug, 'project'),
	validateCaptcha(req => req.project.password && req.body.password),
	(req, res, next) => {
		const COOKIE_NAME = 'partimap.pat'; // pat = project access token :D
		const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

		if (!req.body.visitId) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}

		// projects without password can be accessed freely:
		if (!req.project.password) {
			return next();
		}

		// logged in admin or project owner can bypass password protection:
		if (
			req.isAuthenticated &&
			req.isAuthenticated() &&
			req.user &&
			(req.user.isAdmin || req.project.userId === req.user.id)
		) {
			return next();
		}

		// check received password if any
		if (
			req.body.password &&
			bcrypt.compareSync(req.body.password, req.project.password)
		) {
			const data = {
				projectId: req.project.id,
				visitId: req.body.visitId,
				ip,
			};
			const expSeconds = 60 * 60; // 1 hour
			const token = jwt.sign(data, JWT_SECRET, {
				expiresIn: `${expSeconds}s`,
			});
			res.cookie(COOKIE_NAME, token, { maxAge: expSeconds * 1000 });
			return next();
		}

		// if no password received, verify token
		const token = req.cookies[COOKIE_NAME];
		if (token) {
			try {
				const decoded = jwt.verify(token, JWT_SECRET);
				if (
					decoded.projectId === req.project.id &&
					decoded.visitId === req.body.visitId &&
					decoded.ip === ip
				) {
					// token is valid
					return next();
				}
			} catch (error) {
				// token is invalid/expired
			}
		}

		// token is missing / invalid / expired
		res.status(StatusCodes.UNAUTHORIZED).json({
			title: req.project.title,
			description: req.project.description,
			image: req.project.image,
		});
	},
	async (req, res) => {
		req.project.sheets = await sdb.findByProjectId(req.project.id);
		const user = await udb.findById(req.project.userId);

		await addResultsToProject(req.project);

		req.project.user = {
			color: user.color,
			logo: user.logo,
			website: user.website,
		};
		res.json(hidePasswordField(req.project));
	}
);

module.exports = router;
