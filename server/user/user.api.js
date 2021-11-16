const bcrypt = require('bcryptjs');
const emailValidator = require('email-validator');
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const User = require('../../model/user');
const { ensureLoggedIn, ensureAdmin, ensureAdminOr } = require('../auth/middlewares');
const { hidePasswordField } = require('../common/functions');
const { resolveRecord } = require('../common/middlewares');
const db = require('./user.db');

router.get('/users',
	ensureLoggedIn,
	ensureAdmin,
	async (_, res) => {
		const users = await db.findAll();
		res.json(hidePasswordField(users));
	});

router.get('/user/:id',
	ensureLoggedIn,
	ensureAdminOr(req => Number(req.params.id) === req.user.id),
	resolveRecord(req => req.params.id, db.findById, '_user'),
	(req, res) => res.json(hidePasswordField(req._user)));

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
				if (!changes.oldPassword || !bcrypt.compareSync(changes.oldPassword, req._user.password)) {
					return res.status(StatusCodes.FORBIDDEN).json({ error: 'OLDPASSWORD_INVALID' });
				}
			}
		}

		if (changes.newPassword) {
			changes.password = bcrypt.hashSync(changes.newPassword, 10);
		}

		let user = new User(Object.assign(req._user, changes));
		if (!emailValidator.validate(user.email)) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: 'EMAIL_INVALID' });
		}
		await db.update(user);

		user = await db.findById(user.id);
		res.json(hidePasswordField(user));
	});

router.put('/user',
	ensureLoggedIn,
	ensureAdmin,
	async (req, res) => {
		const user = new User(req.body);
		if (!user.name) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: 'NAME_MISSING' });
		}
		if (!emailValidator.validate(user.email)) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: 'EMAIL_INVALID' });
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
