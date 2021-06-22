const bcrypt = require('bcryptjs');
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const User = require('../../model/user');
const db = require('./user.db');

// TODO ensure logged in + check IDs below

router.get('/my/profile',
	(_, res) => {
		const user = null; // TODO get user from auth
		res.json(user);
	});

router.patch('/my/profile',
	(req, res) => {
		const changes = req.body; // expecting modified fields and ID
		delete changes.instId;
		delete changes.isAdmin;

		const user = null; // TODO get user from auth

		if (changes.password) {
			if (!changes.oldPassword) {
				return res.sendStatus(StatusCodes.BAD_REQUEST);
			}

			if (!bcrypt.compareSync(changes.oldPassword, user.password)) {
				return res.sendStatus(StatusCodes.FORBIDDEN);
			}
		}

		return changeUser(user, changes, res);
	});

// TODO ensure admin role below

router.get('/admin/users',
	async (_, res) => {
		const users = await db.findAll();
		res.json(users);
	});

router.put('/admin/user',
	async (req, res) => {
		const user = new User(req.body);
		if (!user.email || !user.password || !user.name) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}

		user.password = bcrypt.hashSync(user.password, 10);

		const id = await db.create(user);
		res.sendStatus(id ? StatusCodes.CREATED : StatusCodes.CONFLICT);
	});

router.patch('/admin/user',
	async (req, res) => {
		const changes = req.body;
		if (!changes.id) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}

		const user = await db.findById(req.body.id);
		if (!user) {
			return res.sendStatus(StatusCodes.NOT_FOUND);
		}

		return changeUser(user, changes, res);
	});

async function changeUser(user, changes, res) {
	delete changes.id;
	delete changes.registered;

	if (changes.password) {
		changes.password = bcrypt.hashSync(changes.password, 10);
	}
	user = new User(Object.assign(user, changes));
	await db.update(user);

	user = await db.findById(user.id);
	res.json(user);
}

module.exports = router;
