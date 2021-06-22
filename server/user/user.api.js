const bcrypt = require('bcryptjs');
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const User = require('../../model/user');
const db = require('./user.db');

router.get('/', // TODO ensure admin role
	async (_, res) => {
		const users = await db.findAll();
		res.json(users);
	});

router.put('/', // TODO ensure admin role
	async (req, res) => {
		const user = new User(req.body);
		if (!user.email || !user.password || !user.name) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}

		user.password = bcrypt.hashSync(user.password, 10);

		const id = await db.create(user);
		res.sendStatus(id ? StatusCodes.CREATED : StatusCodes.CONFLICT);
	});

router.patch('/', // TODO ensure admin role or body.id = ID of logged in user
	async (req, res) => {
		const changes = req.body; // expecting modified fields and ID
		if (!changes.id) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}

		// TODO if no admin role and changes.password present, require and test changes.oldPassword

		// TODO if no admin role, delete changes.instId and changes.isAdmin

		let user = await db.findById(req.body.id);
		if (!user) {
			return res.sendStatus(StatusCodes.NOT_FOUND);
		}

		if (changes.password) {
			changes.password = bcrypt.hashSync(changes.password, 10);
		}
		user = new User(Object.assign(user, changes));
		await db.update(user);
		user = await db.findById(user.id);

		res.json(user);
	});

module.exports = router;
