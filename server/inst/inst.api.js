const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const Inst = require('../../model/inst');
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

router.get('/my/inst',
	resolveRecord(req => req.user.instId, db.findById, 'inst', true),
	(req, res) => res.json(req.inst));

router.patch('/my/inst',
	resolveRecord(req => req.user.instId, db.findById, 'inst'),
	(req, res) => changeInst(req.inst, req.body, res));

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
	resolveRecord(req => req.body.id, db.findById, 'inst'),
	(req, res) => changeInst(req.inst, req.body, res));

router.delete('/admin/inst/:id',
	async (req, res) => {
		if (!req.params.id) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}
		await db.remove(req.params.id);
		res.end();
	});

async function changeInst(inst, changes, res) {
	delete changes.id;

	inst = new Inst(Object.assign(inst, changes));
	await db.update(inst);

	inst = await db.findById(inst.id);
	res.json(inst);
}

module.exports = router;
