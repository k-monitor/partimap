const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const Project = require('../../model/project');
const { resolveRecord } = require('../common/middlewares');
const db = require('./project.db');

router.get('/project/:id',
	resolveRecord(req => req.params.id, db.findById, 'project'),
	(req, res) => res.json(req.project));

router.get('/my/projects',
	async (req, res) => {
		const projects = await db.findByInstId(req.user.instId);
		res.json(projects);
	});

router.put('/my/project',
	(req, _, next) => {
		req.body.instId = req.user.instId;
		next();
	},
	createProject);

router.patch('/my/project',
	resolveRecord(req => req.body.id, db.findById, 'project'),
	ensureOwnProject,
	(req, res) => changeProject(req.project, req.body, res));

router.get('/admin/projects',
	async (_, res) => {
		const projects = await db.findAll();
		res.json(projects);
	});

router.put('/admin/project',
	createProject);

router.patch('/admin/project',
	resolveRecord(req => req.body.id, db.findById, 'project'),
	(req, res) => changeProject(req.project, req.body, res));

function ensureOwnProject(req, res, next) {
	if (req.user.instId === req.project.instId) {
		next();
	} else {
		res.sendStatus(StatusCodes.UNAUTHORIZED);
	}
}

async function createProject(req, res) {
	let project = new Project(req.body);
	if (!project.title) {
		return res.sendStatus(StatusCodes.BAD_REQUEST);
	}

	const id = await db.create(project);
	project = await db.findById(id);

	res.json(project);
}

async function changeProject(project, changes, res) {
	delete changes.id;

	project = new Project(Object.assign(project, changes));
	await db.update(project);

	project = await db.findById(project.id);
	res.json(project);
}

module.exports = router;
