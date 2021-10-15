const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const rmrf = require('rimraf').sync;
const slugify = require('slugify');
const Project = require('../../model/project');
const { ensureLoggedIn, ensureAdminOr } = require('../auth/middlewares');
const { resolveRecord } = require('../common/middlewares');
const sdb = require('../sheet/sheet.db');
const pdb = require('./project.db');

router.delete('/project/:id',
	ensureLoggedIn,
	resolveRecord(req => req.params.id, pdb.findById, 'project'),
	ensureAdminOr(req => req.project.userId === req.user.id),
	async (req, res) => {
		await pdb.del(req.params.id);
		rmrf(`./uploads/${req.project.id}`);
		res.json({});
	});

router.get('/projects',
	ensureLoggedIn,
	async (req, res) => {
		const projects = req.user.isAdmin
			? await pdb.findAll()
			: await pdb.findByUserId(req.user.id);
		res.json(projects);
	});

router.get('/project/:idOrSlug', // only used in admin, public endpoint is POST /project/access
	ensureLoggedIn,
	resolveRecord(req => req.params.idOrSlug, pdb.findByIdOrSlug, 'project'),
	ensureAdminOr(req => req.project.userId === req.user.id),
	async (req, res) => {
		req.project.sheets = await sdb.findByProjectId(req.project.id);
		res.json(req.project);
	});

router.patch('/project',
	ensureLoggedIn,
	resolveRecord(req => req.body.id, pdb.findById, 'project'),
	ensureAdminOr(req => req.project.userId === req.user.id),
	async (req, res) => {
		const changes = req.body;
		if (!req.user.isAdmin) {
			delete changes.userId;
		}
		if (changes.slug === null || changes.slug === '') {
			// request removes custom slug, generate based on title
			changes.slug = await generateValidSlug(changes.title || req.project.title, req.project.id);
		} else if (changes.slug) {
			// request modifies slug, just validate
			changes.slug = await generateValidSlug(changes.slug, req.project.id);
		}

		let project = new Project(Object.assign(req.project, changes));
		if (!project.title) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}
		await pdb.update(project);

		project = await pdb.findById(project.id);
		res.json(project);
	});

router.put('/project',
	ensureLoggedIn,
	async (req, res) => {
		let project = new Project(req.body);
		if (!project.title) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}
		if (!project.userId || !req.user.isAdmin) {
			project.userId = req.user.id;
		}
		project.slug = await generateValidSlug(project.slug || project.title);

		const id = await pdb.create(project);
		project = await pdb.findById(id);

		res.json(project);
	});

router.post('/project/access',
	resolveRecord(req => req.body.projectId, pdb.findByIdOrSlug, 'project'),
	(req, res, next) => {
		const COOKIE_NAME = 'partimap.pat'; // pat = project access token :D

		console.log(COOKIE_NAME, req.cookies[COOKIE_NAME]);
		console.log('BODY', JSON.stringify(req.body));

		// projects without password can be accessed freely:
		if (!req.project.password) {
			return next();
		}

		// logged in admin or project owner can bypass password protection:
		if (req.isAuthenticated && req.isAuthenticated() &&
			req.user && (req.user.isAdmin || req.project.userId === req.user.id)) {
			return next();
		}

		const pat = req.cookies[COOKIE_NAME];
		if (!pat) { // no cookie => no access
			return res.sendStatus(StatusCodes.UNAUTHORIZED);
		}

		// TODO validate JWT signature
		// TODO validate JWT content (visitId, projectId, ip)

		res.sendStatus(StatusCodes.NOT_IMPLEMENTED);
	},
	async (req, res) => {
		req.project.sheets = await sdb.findByProjectId(req.project.id);
		res.json(req.project);
	}
);

router.post('/view/:idOrSlug',
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
	});

async function generateValidSlug(seed, currentId) {
	const slug = slugify(seed);
	const ep = await pdb.findBySlug(slug);
	if (!ep || ep.id === currentId) { return slug; }
	return generateValidSlug(slug + '-1', currentId);
}

module.exports = router;
