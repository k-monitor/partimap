const bcrypt = require('bcryptjs');
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const User = require('../../model/user');
const { ensureLoggedIn, ensureAdmin, ensureAdminOr } = require('../auth/middlewares');
const { resolveRecord } = require('../common/middlewares');
const db = require('./user.db');

router.get('/users',
	ensureLoggedIn,
	ensureAdmin,
	async (_, res) => {
		const users = await db.findAll();
		res.json(users);
	});

router.get('/user/:id',
	ensureLoggedIn,
	ensureAdminOr(req => Number(req.params.id) === req.user.id),
	resolveRecord(req => req.params.id, db.findById, '_user'),
	(req, res) => res.json(req._user));

router.patch('/user',
	ensureLoggedIn,
	ensureAdminOr(req => req.body.id === req.user.id),
	resolveRecord(req => req.body.id, db.findById, '_user'),
	async (req, res) => {
		const changes = req.body;
		delete changes.password;
		delete changes.registered;

		if (!req.user.isAdmin) {
			delete changes.isAdmin;

			if (changes.newPassword || changes.email !== req._user.email) {
				if (!changes.oldPassword) {
					return res.sendStatus(StatusCodes.BAD_REQUEST);
				}
				if (!bcrypt.compareSync(changes.oldPassword, req._user.password)) {
					return res.sendStatus(StatusCodes.FORBIDDEN);
				}
			}
		}

		if (changes.newPassword) {
			changes.password = bcrypt.hashSync(changes.newPassword, 10);
		}

		let user = new User(Object.assign(req._user, changes));
		if (!user.email) { // TODO email address validation
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}
		await db.update(user);

		user = await db.findById(user.id);
		res.json(user);
	});

router.put('/user',
	ensureLoggedIn,
	ensureAdmin,
	async (req, res) => {
		const user = new User(req.body);
		if (!user.email) { // TODO email address validation
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}

		if (user.password) {
			user.password = bcrypt.hashSync(user.password, 10);
		}

		let id = await db.create(user);
		if (!id) {
			const u = await db.findByEmail(user.email);
			id = u.id;
		}

		res.status(id ? StatusCodes.CREATED : StatusCodes.OK).json({ id });
	});

module.exports = router;
