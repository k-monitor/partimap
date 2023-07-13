const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
	DB_HOST: process.env.DB_HOST || 'localhost',
	DB_PORT: process.env.DB_PORT || 3306,
	DB_USER: process.env.DB_USER,
	DB_PASS: process.env.DB_PASS,
	DB_NAME: process.env.DB_NAME,

	SESSION_SECRET:
		process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex'),
	JWT_SECRET:
		process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex'),

	BASE_URL: process.env.BASE_URL || '',

	SMTP_FROM: process.env.SMTP_FROM,
	SMTP_REPLY_TO: process.env.SMTP_REPLY_TO,
	SMTP_HOST: process.env.SMTP_HOST || 'localhost',
	SMTP_PORT: process.env.SMTP_PORT || 25,
	SMTP_USER: process.env.SMTP_USER,
	SMTP_PASS: process.env.SMTP_PASS,

	RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,

	SUB_EVENTS_DEBOUNCE_MINS: process.env.SUB_EVENTS_DEBOUNCE_MINS || 60,
};
