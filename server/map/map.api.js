const router = require('express').Router();
const Map = require('../../model/map');
const { ensureLoggedIn, ensureAdminOr } = require('../auth/middlewares');
const { resolveRecord } = require('../common/middlewares');
const db = require('./map.db');

router.delete('/map/:id',
	ensureLoggedIn,
	ensureAdminOr(req => Number(req.params.id) === req.user.id),
	resolveRecord(req => req.params.id, db.findById, 'map'),
	async (req, res) => {
		await db.del(req.params.id);
		res.end();
	});

router.get('/maps',
	ensureLoggedIn,
	async (req, res) => {
		const maps = req.user.isAdmin
			? await db.findAll()
			: await db.findByUserId(req.user.id);
		res.json(maps);
	});

router.get('/map/:id',
	ensureLoggedIn,
	ensureAdminOr(req => Number(req.params.id) === req.user.id),
	resolveRecord(req => req.params.id, db.findById, 'map'),
	(req, res) => res.json(req.map));

router.patch('/map',
	ensureLoggedIn,
	resolveRecord(req => req.body.id, db.findById, 'map'),
	ensureAdminOr(req => req.map.userId === req.user.id),
	async (req, res) => {
		const changes = req.body;
		if (!req.user.isAdmin) {
			delete changes.userId;
		}

		let map = new Map(Object.assign(req.map, changes));
		await db.update(map);

		map = await db.findById(map.id);
		res.json(map);
	});

router.put('/map',
	ensureLoggedIn,
	async (req, res) => {
		let map = new Map(req.body);
		if (!map.userId || !req.user.isAdmin) {
			map.userId = req.user.id;
		}

		const id = await db.create(map);
		map = await db.findById(id);

		res.json(map);
	});

module.exports = router;
