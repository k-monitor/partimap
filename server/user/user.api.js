const bcrypt = require('bcryptjs');
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const User = require('../../model/user');
const db = require('./user.db');

router.get('/my/profile',
	(req, res) => res.json(req.user));

router.patch('/my/profile',
	(req, res) => {
		const changes = req.body;
		delete changes.instId;
		delete changes.isAdmin;

		const { user } = req;

		if (changes.newPassword) {
			if (!changes.oldPassword) {
				return res.sendStatus(StatusCodes.BAD_REQUEST);
			}

			if (!bcrypt.compareSync(changes.oldPassword, user.password)) {
				return res.sendStatus(StatusCodes.FORBIDDEN);
			}
		}

		return changeUser(user, changes, res);
	});

router.get('/admin/users',
	async (_, res) => {
		const users = await db.findAll();
		res.json(users);
	});

router.get('/admin/user/:id',
	resolveUser(req => req.params.id),
	async (req, res) => res.json(req._user));

router.put('/admin/user',
	async (req, res) => {
		const user = new User(req.body);
		if (!user.email) {
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

router.patch('/admin/user',
	resolveUser(req => req.body.id),
	(req, res) => changeUser(req._user, req.body, res));

async function changeUser(user, changes, res) {
	delete changes.id;
	delete changes.password;
	delete changes.registered;

	if (changes.newPassword) {
		changes.password = bcrypt.hashSync(changes.newPassword, 10);
	}
	user = new User(Object.assign(user, changes));
	await db.update(user);

	user = await db.findById(user.id);
	res.json(user);
}

function resolveUser(getIdFromReq) {
	return async (req, res, next) => {
		const id = getIdFromReq(req);
		if (!id) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}

		req._user = await db.findById(id);
		if (!req._user) {
			return res.sendStatus(StatusCodes.NOT_FOUND);
		}
		next();
	};
}

module.exports = router;
