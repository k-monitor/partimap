import type { ExecuteValues, RowDataPacket } from 'mysql2/promise';
import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

async function getPool(): Promise<mysql.Pool> {
	if (!pool) {
		pool = await mysql.createPool({
			host: process.env.DB_HOST || 'localhost',
			port: Number(process.env.DB_PORT) || 3306,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
		});
	}
	return pool;
}

export async function query(statement: string, args?: ExecuteValues[]) {
	const pool = await getPool();
	const [rows] = await pool.execute<RowDataPacket[]>(statement, args);
	return rows;
}

export type Query = {
	statement: string;
	args: ExecuteValues[];
};
export function transaction(queries: Query[]) {
	return inTransaction((connection: mysql.Connection) => runQueries(connection, queries));
}

type inTransactionCallback = (connection: mysql.Connection) => Promise<void>;
export async function inTransaction(callback: inTransactionCallback) {
	let error: unknown = null;
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
		if (connection) (connection as any).release();
		// TODO upgrading to v3 might solve type issue
	}
	if (error) throw error;
}

export async function runQueries(connection: mysql.Connection, queries: Query[]) {
	for (let i = 0; i < queries.length; i++) {
		const q = queries[i]!;
		await connection.execute(q.statement, q.args || []);
	}
}

function sqlize(obj: object) {
	const entries = Object.entries(obj).filter((e) => e[1] !== undefined);
	const fields = entries.map((e) => e[0]);
	const values = entries.map((e) => e[1]) as ExecuteValues[];
	return {
		fields,
		values,
		cols: fields.join(', '),
		sets: fields.map((f) => f + ' = ?').join(', '),
		qmarks: values.map(() => '?').join(', '),
	};
}

export async function create(table: string, record: object, Model: (data: object) => object) {
	const q = createQuery(table, record, Model);
	const res = await query(q.statement, q.args);
	const insertId: number = (res as any).insertId;
	return insertId > 0 ? insertId : false;
}

export function createQuery(table: string, record: object, Model: (data: object) => object) {
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

export async function findAll(table: string, Model: (data: object) => object) {
	const rows = await query(`SELECT * FROM ${table}`);
	return rows.map((r) => Model(r));
}

export async function findAllBy(
	table: string,
	field: string,
	value: ExecuteValues,
	Model: (data: object) => object,
) {
	const rows = await query(`SELECT * FROM ${table} WHERE ${field} = ?`, [value]);
	return rows.map((r) => Model(r));
}

export async function findBy(
	table: string,
	field: string,
	value: ExecuteValues,
	Model: (data: object) => object,
) {
	const rows = await query(`SELECT * FROM ${table} WHERE ${field} = ?`, [value]);
	return rows.map((r) => Model(r))[0];
}

export function updateQuery(table: string, record: object, Model: (data: object) => object) {
	const model = Model(record);
	const { id } = model;
	delete model.id;
	const m = sqlize(model);
	return {
		statement: `UPDATE ${table} SET ${m.sets} WHERE id = ?`,
		args: [...m.values, id],
	};
}

export async function update(table: string, record: object, Model: (data: object) => object) {
	const q = updateQuery(table, record, Model);
	return query(q.statement, q.args);
}
