import mysql from 'mysql2/promise';
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

export async function query(statement: string, args: any[]) {
	const pool = await getPool();
	const [rows] = await pool.execute(statement, args);
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

async function runQueries(connection: mysql.Connection, queries: Query[]) {
	for (let i = 0; i < queries.length; i++) {
		const q = queries[i];
		await connection.execute(q.statement, q.args || []);
	}
}
