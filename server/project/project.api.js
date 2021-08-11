const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const Project = require('../../model/project');
const { ensureLoggedIn, ensureAdminOr } = require('../auth/middlewares');
const { resolveRecord } = require('../common/middlewares');
const db = require('./project.db');

router.get('/projects',
	ensureLoggedIn,
	async (req, res) => {
		const projects = req.user.isAdmin
			? await db.findAll()
			: await db.findByUserId(req.user.id);
		res.json(projects);
	});

router.get('/project/:id',
	resolveRecord(req => req.params.id, db.findById, 'project'),
	(req, res) => res.json(req.project));

router.patch('/project',
	ensureLoggedIn,
	resolveRecord(req => req.body.id, db.findById, 'project'),
	ensureAdminOr(req => req.project.userId === req.user.id),
	async (req, res) => {
		const changes = req.body;
		if (!req.user.isAdmin) {
			delete changes.userId;
		}

		let project = new Project(Object.assign(req.project, changes));
		if (!project.title) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}
		await db.update(project);

		project = await db.findById(project.id);
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

		const id = await db.create(project);
		project = await db.findById(id);

		res.json(project);
	});

module.exports = router;
