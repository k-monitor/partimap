const mysql = require('mysql2/promise');
const conf = require('./conf');

/** @typedef { statement: String, args: Object[] } Query */

const dbConf = {
	host: conf.DB_HOST,
	port: conf.DB_PORT,
	user: conf.DB_USER,
	password: conf.DB_PASS,
	database: conf.DB_NAME,
};

let pool = null;

async function init() {
	pool = await mysql.createPool(dbConf);
}

async function query(statement, args) {
	const connection = pool || (await mysql.createConnection(dbConf));
	const [rows] = await connection.execute(statement, args);
	if (!pool) {
		await connection.end();
	}
	return rows;
}

/**
 * @param {Query[]} queries
 * @returns {Promise}
 */
function transaction(queries) {
	return inTransaction(connection => runQueries(connection, queries));
}

/**
 * @callback inTransactionCallback
 * @param {import('mysql2/typings/mysql/lib/Connection')} connection
 * @returns {Promise}
 */

/**
 * @param {inTransactionCallback} fn
 * @returns {Promise}
 */
async function inTransaction(fn) {
	let error = false;
	let connection;
	try {
		if (pool) {
			connection = await pool.getConnection();
		} else {
			connection = await mysql.createConnection(dbConf);
		}
		await connection.beginTransaction();
		await fn(connection);
		await connection.commit();
	} catch (e) {
		error = e;
		if (connection) await connection.rollback();
	} finally {
		if (connection) connection.release();
	}
	if (error) throw error;
}

/**
 * @param {import('mysql2/typings/mysql/lib/Connection')} connection
 * @param {Query[]} queries
 * @returns {Promise}
 */
async function runQueries(connection, queries) {
	for (let i = 0; i < queries.length; i++) {
		const q = queries[i];
		await connection.execute(q.statement, q.args || []);
	}
}

function sqlize(obj) {
	const entries = Object.entries(obj).filter(e => e[1] !== undefined);
	const fields = entries.map(e => e[0]);
	const values = entries.map(e => e[1]);
	return {
		fields,
		values,
		cols: fields.join(', '),
		sets: fields.map(f => f + ' = ?').join(', '),
		qmarks: values.map(_ => '?').join(', '),
	};
}

async function create(table, record, Model) {
	const q = createQuery(table, record, Model);
	const { insertId } = await query(q.statement, q.args);
	return insertId > 0 ? insertId : false;
}

function createQuery(table, record, Model) {
	const model = new Model(record);
	delete model.id;
	const i = sqlize(model);
	return {
		statement: `INSERT IGNORE INTO ${table} (${i.cols}) VALUES (${i.qmarks})`,
		args: i.values,
	};
}

/**
 * @param {String} table
 * @param {Number} id
 * @return {Boolean}
 */
async function del(table, id) {
	const { affectedRows } = await query(`DELETE FROM ${table} WHERE id = ?`, [
		id,
	]);
	return affectedRows === 1;
}

/**
 * @param {String} table
 * @param {Function} Model
 */
async function findAll(table, Model) {
	const rows = await query(`SELECT * FROM ${table}`);
	return rows.map(r => new Model(r));
}

/**
 * @param {String} table
 * @param {String} field
 * @param {any} value
 * @param {Function} Model
 */
async function findBy(table, field, value, Model) {
	const rows = await query(`SELECT * FROM ${table} WHERE ${field} = ?`, [
		value,
	]);
	return rows.map(r => new Model(r))[0];
}

/**
 * @param {String} table
 * @param {Object} record
 * @param {Function} Model
 */
function update(table, record, Model) {
	const model = new Model(record);
	const { id } = model;
	delete model.id;
	const m = sqlize(model);
	return query(`UPDATE ${table} SET ${m.sets} WHERE id = ?`, [
		...m.values,
		id,
	]);
}

module.exports = {
	init,
	query,
	transaction,
	inTransaction,
	runQueries,
	sqlize,
	create,
	createQuery,
	findAll,
	findBy,
	update,
	del,
};
