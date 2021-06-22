const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const Inst = require('../../model/inst');
const db = require('./inst.db');

router.get('/insts',
	async (_, res) => {
		const insts = await db.findAll();
		res.json(insts);
	});

// TODO ensure logged in + check IDs below

router.get('/my/inst',
	async (_, res) => {
		const user = null; // TODO get user from auth

		const inst = await db.findById(user.instId);
		if (!inst) {
			return res.sendStatus(StatusCodes.NOT_FOUND);
		}

		res.json(inst);
	});

router.patch('/my/inst',
	async (req, res) => {
		const user = null; // TODO get user from auth
		const changes = req.body;

		const inst = await db.findById(user.instId);
		if (!inst) {
			return res.sendStatus(StatusCodes.NOT_FOUND);
		}

		return changeInst(inst, changes, res);
	});

// TODO ensure admin role below

router.put('/admin/inst',
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

router.patch('/admin/inst',
	async (req, res) => {
		const changes = new Inst(req.body);
		if (!changes.id) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}

		const inst = await db.findById(changes.id);
		if (!inst) {
			return res.sendStatus(StatusCodes.NOT_FOUND);
		}

		return changeInst(inst, changes, res);
	});

router.delete('/admin/inst/:id',
	async (req, res) => {
		if (!req.params.id) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}

		await db.remove(req.params.id);

		const insts = await db.findAll();
		res.json(insts);
	});

async function changeInst(inst, changes, res) {
	delete changes.id;

	inst = new Inst(Object.assign(inst, changes));
	await db.update(inst);

	inst = await db.findById(inst.id);
	res.json(inst);
}

module.exports = router;
