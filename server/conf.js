require('dotenv').config();

module.exports = {
	DB_HOST: process.env.DB_HOST || 'localhost',
	DB_PORT: process.env.DB_PORT || 3306,
	DB_USER: process.env.DB_USER,
	DB_PASS: process.env.DB_PASS,
	DB_NAME: process.env.DB_NAME,
	SESSION_SECRET: process.env.SESSION_SECRET || Math.random()
};
