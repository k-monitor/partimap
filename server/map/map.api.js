const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const Map = require('../../model/map');
const { ensureLoggedIn, ensureAdminOr } = require('../auth/middlewares');
const { resolveRecord } = require('../common/middlewares');
const sfdb = require('../submittedFeatures/submittedFeatures.db');
const db = require('./map.db');

router.delete(
	'/map/:id',
	ensureLoggedIn,
	resolveRecord(req => req.params.id, db.findById, 'map'),
	ensureAdminOr(req => req.map.userId === req.user.id),
	async (req, res) => {
		await db.del(req.params.id);
		res.json({});
	}
);

router.get('/maps', ensureLoggedIn, async (req, res) => {
	const maps = req.user.isAdmin
		? await db.findAll()
		: await db.findByUserId(req.user.id);
	res.json(maps);
});

router.get(
	'/map/:id',
	ensureLoggedIn,
	resolveRecord(req => req.params.id, db.findById, 'map'),
	ensureAdminOr(req => req.map.userId === req.user.id),
	(req, res) => res.json(req.map)
);

router.patch(
	'/map',
	ensureLoggedIn,
	resolveRecord(req => req.body.id, db.findById, 'map'),
	ensureAdminOr(req => req.map.userId === req.user.id),
	async (req, res) => {
		const changes = req.body;
		if (!req.user.isAdmin) {
			delete changes.userId;
		}

		let map = new Map(Object.assign(req.map, changes));
		if (!map.title) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}
		await db.update(map);

		map = await db.findById(map.id);
		res.json(map);
	}
);

router.put('/map', ensureLoggedIn, async (req, res) => {
	let map = new Map(req.body);
	if (!map.title) {
		return res.sendStatus(StatusCodes.BAD_REQUEST);
	}
	if (!map.userId || !req.user.isAdmin) {
		map.userId = req.user.id;
	}

	if (req.body.importSubmittedFeatures) {
		// sheetID
		const features = [];
		const sfs = await sfdb.findBySheetId(req.body.importSubmittedFeatures);
		(sfs || []).forEach(sf => features.push(...JSON.parse(sf.features)));
		features.forEach(f => {
			f.properties.category = f.geometry.type;
		});
		map.features = JSON.stringify(features);
	}

	const id = await db.create(map);
	map = await db.findById(id);

	res.json(map);
});

module.exports = router;
