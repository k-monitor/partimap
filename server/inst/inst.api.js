const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const Inst = require('../../model/inst');
const { ensureLoggedIn, ensureAdmin, ensureAdminOr } = require('../auth/middlewares');
const { resolveRecord } = require('../common/middlewares');
const db = require('./inst.db');

router.get('/insts',
	async (_, res) => {
		const insts = await db.findAll();
		res.json(insts);
	});

router.get('/inst/:id',
	resolveRecord(req => req.params.id, db.findById, 'inst'),
	(req, res) => res.json(req.inst));

router.patch('/inst',
	ensureLoggedIn,
	ensureAdminOr(req => req.body.id === req.user.instId),
	resolveRecord(req => req.body.id, db.findById, 'inst'),
	async (req, res) => {
		let inst = new Inst(Object.assign(req.inst,  req.body));
		if (!inst.name) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}
		await db.update(inst);

		inst = await db.findById(req.inst.id);
		res.json(inst);
	});

router.put('/inst',
	ensureLoggedIn,
	ensureAdmin,
	async (req, res) => {
		let inst = new Inst(req.body);
		if (!inst.name) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}

		const id = await db.create(inst);
		const status = id ? StatusCodes.CREATED : StatusCodes.OK;
		inst = await db.findByName(inst.name);

		res.status(status).json(inst);
	});

router.delete('/inst/:id',
	ensureLoggedIn,
	ensureAdmin,
	async (req, res) => {
		if (!req.params.id) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}
		await db.remove(req.params.id);
		res.end();
	});

module.exports = router;
