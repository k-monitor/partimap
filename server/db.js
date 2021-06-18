const mysql = require('mysql2/promise');
const conf = require('./conf');

const dbConf = {
	host: conf.DB_HOST,
	port: conf.DB_PORT,
	user: conf.DB_USER,
	password: conf.DB_PASS,
	database: conf.DB_NAME
};

let pool = null;

async function init() {
	pool = await mysql.createPool(dbConf);
}

async function query(statement, args) {
	const connection = pool || await mysql.createConnection(dbConf);
	const [rows] = await connection.execute(statement, args);
	if (!pool) { await connection.end(); }
	return rows;
}

function sqlize(obj) {
	const entries = Object.entries(obj);
	const fields = entries.map(e => e[0]);
	const values = entries.map(e => e[1]);
	return {
		fields,
		values,
		cols: fields.join(', '),
		sets: fields.map(f => f + ' = ?').join(', '),
		qmarks: values.map(_ => '?').join(', ')
	};
}

module.exports = {
	init,
	query,
	sqlize
};
