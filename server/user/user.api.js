const bcrypt = require('bcryptjs');
const emailValidator = require('email-validator');
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const { v4: uuid } = require('uuid');
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
		delete changes.token;
		delete changes.tokenExpires;

		if (!req.user.isAdmin) {
			delete changes.active;
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
	async (req, res) => {
		if (!req.body.consent && (!req.user || !req.user.isAdmin)) { // public reg
			return res.status(StatusCodes.BAD_REQUEST).json({ error: 'CONSENT_MISSING' });
		}
		const newUser = new User(req.body);
		delete newUser.id;
		delete newUser.token;
		delete newUser.tokenExpires;

		if (!newUser.name) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: 'NAME_MISSING' });
		}
		if (!emailValidator.validate(newUser.email)) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: 'EMAIL_INVALID' });
		}

		if (newUser.password) {
			newUser.password = bcrypt.hashSync(newUser.password, 10);
		}

		newUser.active = false;
		newUser.registered = new Date().getTime();
		newUser.token = uuid();
		newUser.tokenExpires = newUser.registered + (24 * 60 * 60 * 1000);

		let user = await db.findByEmail(newUser.email);
		if (!user) {
			await db.create(newUser);
		} else if (!user.active) {
			// user already exists, but inactive, let them re-register
			await db.update(Object.assign(user, newUser));
		} else {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: 'USER_ALREADY_EXISTS' });
		}

		user = await db.findByEmail(newUser.email);

		if (!req.user || !req.user.isAdmin) { // public reg
			// TODO send activation email
		}

		if (req.user && req.user.isAdmin) {
			res.json({ id: user.id });
		} else { // public reg
			res.end();
		}
	});

module.exports = router;
