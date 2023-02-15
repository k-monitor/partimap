const fs = require('fs');
const bcrypt = require('bcryptjs');
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const rmrf = require('rimraf').sync;
const slugify = require('slugify');
const Project = require('../../model/project');
const { ensureLoggedIn, ensureAdminOr } = require('../auth/middlewares');
const { hidePasswordField } = require('../common/functions');
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

function removeProjectImageFile(project) {
	if (project.image) {
		const fn = `.${project.image}`; // make it relative for server
		if (fs.existsSync(fn)) {
			fs.unlinkSync(fn);
		}
	}
}

router.put(
	'/project/:id/image',
	ensureLoggedIn,
	resolveRecord(req => req.params.id, pdb.findById, 'project'),
	ensureAdminOr(req => req.project.userId === req.user.id),
	acceptImage(req => req.project.id, 1200, 1200, 'image'),
	async (req, res) => {
		removeProjectImageFile(req.project);
		req.project.image = req.image.replace(/^\./, ''); // make it absolute for client
		await pdb.update(req.project);
		const project = await pdb.findById(req.project.id);
		res.json(hidePasswordField(project));
	}
);

router.delete(
	'/project/:id',
	ensureLoggedIn,
	resolveRecord(req => req.params.id, pdb.findById, 'project'),
	ensureAdminOr(req => req.project.userId === req.user.id),
	async (req, res) => {
		await pdb.del(req.params.id);
		rmrf(`./uploads/${req.project.id}`);
		res.json({});
	}
);

router.get('/projects', ensureLoggedIn, async (req, res) => {
	const projects = req.user.isAdmin
		? await pdb.findAll()
		: await pdb.findByUserId(req.user.id);
	res.json(hidePasswordField(projects));
});

router.get(
	'/project/:idOrSlug', // only used in admin, public endpoint is POST /project/access
	ensureLoggedIn,
	resolveRecord(req => req.params.idOrSlug, pdb.findByIdOrSlug, 'project'),
	ensureAdminOr(req => req.project.userId === req.user.id),
	async (req, res) => {
		req.project.sheets = await sdb.findByProjectId(req.project.id);
		res.json(hidePasswordField(req.project));
	}
);

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

	const id = await pdb.create(project);
	project = await pdb.findById(id);

	res.json(hidePasswordField(project));
});

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
		try {
			const answers = await sadb.aggregateByProjectId(req.project.id);
			req.project.sheets.forEach(s => {
				s.answers = answers.filter(a => a.sheetId === s.id);
			});

			const promises = req.project.sheets.map(async s => {
				const arr = await rdb.aggregateBySheetId(s.id);
				const dict = {};
				arr.forEach(ar => {
					dict[ar.featureId] = ar;
				});
				s.ratings = dict;
			});
			await Promise.all(promises);
		} catch {
			req.project.sheets.forEach(s => {
				s.answers = [];
			});
		}
		req.project.user = {
			logo: user.logo,
			website: user.website,
		};
		res.json(hidePasswordField(req.project));
	}
);

router.post(
	'/view/:idOrSlug',
	resolveRecord(req => req.params.idOrSlug, pdb.findByIdOrSlug, 'project'),
	async (req, res) => {
		const exp = `/p/${req.params.idOrSlug}/0`;
		if (!req.headers.referer.endsWith(exp)) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}
		if (req.user && (req.user.isAdmin || req.user.id === req.project.id)) {
			return res.end();
		}
		await pdb.incrementViewsById(req.project.id);
		res.end();
	}
);

async function generateValidSlug(seed, currentId) {
	const slug = slugify(seed);
	const ep = await pdb.findBySlug(slug);
	if (!ep || ep.id === currentId) {
		return slug;
	}
	return generateValidSlug(slug + '-1', currentId);
}

module.exports = router;
