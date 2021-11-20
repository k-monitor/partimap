const fs = require('fs');
const bcrypt = require('bcryptjs');
const emailValidator = require('email-validator');
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const rmrf = require('rimraf').sync;
const { v4: uuid } = require('uuid');
const User = require('../../model/user');
const { ensureLoggedIn, ensureAdmin, ensureAdminOr } = require('../auth/middlewares');
const { hidePasswordField } = require('../common/functions');
const { acceptImage, resolveRecord, validateCaptcha } = require('../common/middlewares');
const conf = require('../conf');
const { sendEmail } = require('../email');
const pdb = require('../project/project.db');
const db = require('./user.db');

function removeUserLogoFile(user) {
	if (user.logo) {
		const fn = `.${user.logo}`; // make it relative for server
		if (fs.existsSync(fn)) {
			fs.unlinkSync(fn);
		}
	}
}

router.put('/user/:id/logo',
	ensureLoggedIn,
	ensureAdminOr(req => Number(req.params.id) === req.user.id),
	resolveRecord(req => req.params.id, db.findById, '_user'),
	acceptImage(_req => 'u', 120, 30, 'image'),
	async (req, res) => {
		removeUserLogoFile(req._user);
		req._user.logo = req.image.replace(/^\./, ''); // make it absolute for client
		await db.update(req._user);
		const user = await db.findById(req._user.id);
		res.json(hidePasswordField(user));
	});

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
	validateCaptcha(req => !req.user || !req.user.isAdmin), // no captcha on admin page
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
		addToken(newUser);

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

		if (req.user && req.user.isAdmin) {
			// new user registered by admin
			// return ID so UI can open user details
			res.json({ id: user.id });
		} else {
			// new user registered on their own
			// send activation email
			const url = `${conf.BASE_URL}/login?t=${user.token}`;
			await sendEmail(user.email, 'Új fiók aktiválása', `
				<p><b>Kedves ${user.name}!</p>
				<p>Kérlek véglegesítsd Partimap regisztrációdat az alábbi hivatkozás megnyitásával:<br>
				<a href="${url}">${url}</a></p>
				<p>Ez a link 24 óráig érvényes, utána újra kell regisztrálnod.</p>
			`);
			res.end();
		}
	});

router.post('/user/activate',
	async (req, res) => {
		const user = await db.findByToken(req.body.token);
		if (!user || user.tokenExpires < new Date().getTime()) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: 'TOKEN_INVALID' });
		}
		user.active = true;
		user.token = null;
		user.tokenExpires = null;
		await db.update(user);
		res.end();
	});

router.post('/user/forgot',
	validateCaptcha(),
	async (req, res) => {
		const user = await db.findByEmail(req.body.email);
		if (!user) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: 'EMAIL_INVALID' });
		}
		addToken(user);
		await db.update(user);
		const url = `${conf.BASE_URL}/pwch?t=${user.token}`;
		await sendEmail(user.email, 'Elfelejtett jelszó', `
			<p><b>Kedves ${user.name}!</p>
			<p>A Partimap fiókodhoz tartozó jelszavadat az alábbi hivatkozás megnyitásával cserélheted:<br>
			<a href="${url}">${url}</a></p>
			<p>Ez a link 24 óráig érvényes, utána újra kell kérvényezned a jelszócserét az "Elfelejtettem a jelszavam" opcióval.</p>
		`);
		res.end();
	});

router.post('/user/pwch',
	validateCaptcha(),
	async (req, res) => {
		const { password, token } = req.body;
		const user = await db.findByToken(token);
		if (!user || user.tokenExpires < new Date().getTime()) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: 'TOKEN_INVALID' });
		}
		if (!password) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: 'PASSWORD_MISSING' });
		}
		user.password = bcrypt.hashSync(password, 10);
		user.token = null;
		user.tokenExpires = null;
		await db.update(user);
		res.end();
	});

router.post('/user/delete',
	resolveRecord(req => req.body.id, db.findById, '_user'),
	async (req, res) => {
		const { id, password } = req.body;

		// checking CURRENT user's password (not the selected user's)
		if (!password || !bcrypt.compareSync(password, req.user.password)) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: 'PASSWORD_INVALID' });
		}

		const projects = await pdb.findByUserId(id);
		for (const p of projects) {
			rmrf(`./uploads/${p.id}`);
		}
		await db.del(id); // deletes all records

		if (req.user && req.user.id === id) {
			req.logout();
		}
		res.end();
	});
function addToken(user) {
	user.token = uuid();
	user.tokenExpires = new Date().getTime() + (24 * 60 * 60 * 1000);
}

module.exports = router;
