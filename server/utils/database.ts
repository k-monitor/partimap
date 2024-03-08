import mysql, { RowDataPacket } from 'mysql2/promise';
import { env } from '~/env';

let pool: mysql.Pool | null = null;

async function getPool(): Promise<mysql.Pool> {
	if (!pool) {
		pool = await mysql.createPool({
			host: env.DB_HOST,
			port: env.DB_PORT,
			user: env.DB_USER,
			password: env.DB_PASS,
			database: env.DB_NAME,
		});
	}
	return pool;
}

export async function query(statement: string, args?: any[]) {
	const pool = await getPool();
	const [rows] = await pool.execute<RowDataPacket[]>(statement, args);
	return rows;
}

type Query = {
	statement: string;
	args: any[];
};
export function transaction(queries: Query[]) {
	return inTransaction((connection: mysql.Connection) => runQueries(connection, queries));
}

type inTransactionCallback = (pool: mysql.Connection) => Promise<any>;
async function inTransaction(callback: inTransactionCallback) {
	let error: any = false;
	const pool = await getPool();
	let connection: mysql.Connection | null = null;
	try {
		connection = await pool.getConnection();
		await connection.beginTransaction();
		await callback(connection);
		await connection.commit();
	} catch (e) {
		error = e;
		if (connection) await connection.rollback();
	} finally {
		if (connection) connection.end();
	}
	if (error) throw error;
}

export async function runQueries(connection: mysql.Connection, queries: Query[]) {
	for (let i = 0; i < queries.length; i++) {
		const q = queries[i];
		await connection.execute(q.statement, q.args || []);
	}
}

function sqlize(obj: any) {
	const entries = Object.entries(obj).filter((e) => e[1] !== undefined);
	const fields = entries.map((e) => e[0]);
	const values = entries.map((e) => e[1]);
	return {
		fields,
		values,
		cols: fields.join(', '),
		sets: fields.map((f) => f + ' = ?').join(', '),
		qmarks: values.map(() => '?').join(', '),
	};
}

export async function create(table: string, record: any, Model: (data: any) => any) {
	const q = createQuery(table, record, Model);
	const res = await query(q.statement, q.args);
	const insertId: number = (res as any).insertId;
	return insertId > 0 ? insertId : false;
}

export function createQuery(table: string, record: any, Model: (data: any) => any) {
	const model = Model(record);
	delete model.id;
	const i = sqlize(model);
	return {
		statement: `INSERT IGNORE INTO ${table} (${i.cols}) VALUES (${i.qmarks})`,
		args: i.values,
	};
}

export async function del(table: string, id: number) {
	const res = await query(`DELETE FROM ${table} WHERE id = ?`, [id]);
	return (res as any).affectedRows === 1;
}

/**
 * @param {String} table
 * @param {Function} Model
 */
export async function findAll(table: string, Model: (data: any) => any) {
	const rows = await query(`SELECT * FROM ${table}`);
	return rows.map((r) => Model(r));
}

/**
 * @param {String} table
 * @param {String} field
 * @param {any} value
 * @param {Function} Model
 */
export async function findBy(table: string, field: string, value: any, Model: (data: any) => any) {
	const rows = await query(`SELECT * FROM ${table} WHERE ${field} = ?`, [value]);
	return rows.map((r) => Model(r))[0];
}

/**
 * @param {String} table
 * @param {Object} record
 * @param {Function} Model
 */
export function update(table: string, record: any, Model: (data: any) => any) {
	const model = Model(record);
	const { id } = model;
	delete model.id;
	const m = sqlize(model);
	return query(`UPDATE ${table} SET ${m.sets} WHERE id = ?`, [...m.values, id]);
}
