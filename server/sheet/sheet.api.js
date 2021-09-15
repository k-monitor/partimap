const fs = require('fs');
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const Sheet = require('../../model/sheet');
const { ensureLoggedIn, ensureAdminOr } = require('../auth/middlewares');
const { acceptImage, resolveRecord } = require('../common/middlewares');
const pdb = require('../project/project.db');
const sdb = require('./sheet.db');

router.put('/sheet/:id/image',
	ensureLoggedIn,
	resolveRecord(req => req.params.id, sdb.findById, 'sheet'),
	resolveRecord(req => req.sheet.projectId, pdb.findById, 'project'),
	ensureAdminOr(req => req.project.userId === req.user.id),
	acceptImage(req => req.project.id, 1920, 1200, 'image'),
	async (req, res) => {
		// removing previous image
		if (req.sheet.image) {
			const fn = `.${req.sheet.image}`; // make it relative for server
			if (fs.existsSync(fn)) {
				fs.unlinkSync(fn);
			}
		}

		// updating sheet with new image URL
		req.sheet.image = req.image.replace(/^\./, ''); // make it absolute for client
		await sdb.update(req.sheet);
		const sheet = await sdb.findById(req.sheet.id);
		res.json(sheet);
	});

router.delete('/sheet/:id',
	ensureLoggedIn,
	resolveRecord(req => req.params.id, sdb.findById, 'sheet'),
	resolveRecord(req => req.sheet.projectId, pdb.findById, 'project'),
	ensureAdminOr(req => req.project.userId === req.user.id),
	async (req, res) => {
		await sdb.del(req.params.id);
		// TODO delete image file if exists
		res.json({});
	});

router.get('/project/:id/sheets',
	resolveRecord(req => req.params.id, pdb.findById, 'project'),
	async (req, res) => {
		const sheets = await sdb.findByProjectId(req.params.id);
		res.json(sheets);
	});

router.get('/project/:id/sheet/:ord',
	resolveRecord(req => req.params.id, pdb.findById, 'project'),
	async (req, res) => {
		const sheet = await sdb.findByProjectIdAndOrder(req.params.id, req.params.ord);
		if (!sheet) {
			return res.sendStatus(StatusCodes.NOT_FOUND);
		}
		res.json(sheet);
	});

router.get('/sheet/:id',
	resolveRecord(req => req.params.id, sdb.findById, 'sheet'),
	(req, res) => res.json(req.sheet));

router.patch('/sheet',
	ensureLoggedIn,
	resolveRecord(req => req.body.id, sdb.findById, 'sheet'),
	resolveRecord(req => req.sheet.projectId, pdb.findById, 'project'),
	ensureAdminOr(req => req.project.userId === req.user.id),
	async (req, res) => {
		const changes = req.body;
		delete changes.projectId;

		let sheet = new Sheet(Object.assign(req.sheet, changes));
		if (!sheet.title) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}
		await sdb.update(sheet);

		sheet = await sdb.findById(sheet.id);
		res.json(sheet);
	});

router.put('/project/:id/sheet',
	ensureLoggedIn,
	resolveRecord(req => req.params.id, pdb.findById, 'project'),
	ensureAdminOr(req => req.project.userId === req.user.id),
	async (req, res) => {
		let sheet = new Sheet(req.body);
		sheet.projectId = req.params.id;
		if (!sheet.title) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}

		const id = await sdb.create(sheet);
		sheet = await sdb.findById(id);

		res.json(sheet);
	});

module.exports = router;
