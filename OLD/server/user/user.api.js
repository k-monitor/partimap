const bcrypt = require('bcryptjs');
const emailValidator = require('email-validator');
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const { v4: uuid } = require('uuid');
const User = require('../../model/user');
const i18n = require('../common/i18n');
const {
	validateCaptcha,
} = require('../common/middlewares');
const conf = require('../conf');
const { sendEmail } = require('../email');
const db = require('./user.db');

router.put(
	'/user',
	validateCaptcha(req => !req.user || !req.user.isAdmin), // no captcha on admin page
	async (req, res) => {
		const m = i18n(req.body.locale).activationEmail;
		if (!req.body.consent && (!req.user || !req.user.isAdmin)) {
			// public reg
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'CONSENT_MISSING' });
		}
		const newUser = new User(req.body);
		delete newUser.id;
		delete newUser.logo;
		delete newUser.token;
		delete newUser.tokenExpires;

		if (!newUser.name) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'NAME_MISSING' });
		}
		if (!emailValidator.validate(newUser.email)) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'EMAIL_INVALID' });
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
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'USER_ALREADY_EXISTS' });
		}

		user = await db.findByEmail(newUser.email);

		if (req.user && req.user.isAdmin) {
			// new user registered by admin
			// return ID so UI can open user details
			res.json({ id: user.id });
		} else {
			// new user registered on their own
			// send activation email
			const url = `${conf.BASE_URL}/${req.body.locale}/login?t=${user.token}`;
			const body = m.body
				.replace(/\{user\}/g, user.name)
				.replace(/\{url\}/g, url);
			await sendEmail(user.email, m.subject, body);
			res.end();
		}
	}
);

router.post('/user/forgot', validateCaptcha(), async (req, res) => {
	const m = i18n(req.body.locale).forgotEmail;
	const user = await db.findByEmail(req.body.email);
	if (!user) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'EMAIL_INVALID' });
	}
	addToken(user);
	await db.update(user);
	const url = `${conf.BASE_URL}/${req.body.locale}/pwch?t=${user.token}`;
	const body = m.body
		.replace(/\{user\}/g, user.name)
		.replace(/\{url\}/g, url);
	await sendEmail(user.email, m.subject, body);
	res.end();
});

router.post('/user/pwch', validateCaptcha(), async (req, res) => {
	const { password, token } = req.body;
	const user = await db.findByToken(token);
	if (!user || user.tokenExpires < new Date().getTime()) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'TOKEN_INVALID' });
	}
	if (!password) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'PASSWORD_MISSING' });
	}
	user.password = bcrypt.hashSync(password, 10);
	user.token = null;
	user.tokenExpires = null;
	await db.update(user);
	res.end();
});

function addToken(user) {
	user.token = uuid();
	user.tokenExpires = new Date().getTime() + 24 * 60 * 60 * 1000;
}

module.exports = router;
