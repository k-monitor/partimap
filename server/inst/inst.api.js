const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const Inst = require('../../model/inst');
const db = require('./inst.db');

router.get('/',
	async (_, res) => {
		const insts = await db.findAll();
		res.json(insts);
	});

router.put('/', // TODO ensure admin role
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

router.patch('/', // TODO ensure admin role or inst (!) member
	async (req, res) => {
		let inst = new Inst(req.body); // expecting full Inst object, not just changeset
		if (!inst.id) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}

		await db.update(inst);
		inst = await db.findById(inst.id);

		res.json(inst);
	});

router.delete('/:id', // TODO ensure admin role
	async (req, res) => {
		if (!req.params.id) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}

		await db.remove(req.params.id);
		const insts = await db.findAll();
		res.json(insts);
	});

module.exports = router;
