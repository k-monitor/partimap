const db = require('../db');
const Sheet = require('../../model/sheet');

const DEFAULT_NEW_SHEET_ORD = 9999;

/**
 * @param {Sheet} sheet
 * @returns {Number|Boolean}
 */
async function create(sheet) {
	sheet.ord = DEFAULT_NEW_SHEET_ORD;
	const id = await db.create('sheet', sheet, Sheet);
	await reorderSheets(sheet.projectId);
	return id;
}

/**
 * @param {Number} id
 */
async function del(id) {
	const sheet = await findById(id);
	await db.del('sheet', id);
	await reorderSheets(sheet.projectId);
}

/**
 * @param {Number} id
 * @returns {Sheet}
 */
function findById(id) {
	return db.findBy('sheet', 'id', id, Sheet);
}

/**
 * @param {Number} projectId
 * @returns {Sheet[]}
 */
async function findByProjectId(projectId) {
	const rows = await db.query('SELECT * FROM sheet WHERE projectId = ? ORDER BY ord, id', [projectId]);
	return rows.map(r => new Sheet(r));
}

/**
 * @param {Number} projectId
 * @param {Number} ord
 * @returns {Sheet}
 */
async function findByProjectIdAndOrder(projectId, ord) {
	const rows = await db.query('SELECT * FROM sheet WHERE project = ? AND ord = ?', [projectId, ord]);
	return rows.map(r => new Sheet(r))[0];
}

/**
 * @param {Sheet} sheet
 */
async function update(sheet) {
	const oldSheet = await findById(sheet.id);
	if (oldSheet.ord < sheet.ord) { // so we increase ord
		await db.query('UPDATE sheet SET ord = ord - 1 WHERE projectId = ? AND ord BETWEEN ? AND ?',
			[sheet.projectId, oldSheet.ord + 1, sheet.ord]);
	} else if (oldSheet.ord > sheet.ord) {
		await db.query('UPDATE sheet SET ord = ord + 1 WHERE projectId = ? AND ord BETWEEN ? AND ?',
			[sheet.projectId, sheet.ord, oldSheet.ord - 1]);
	}
	await db.update('sheet', sheet, Sheet);
	await reorderSheets(sheet.projectId);
}

async function reorderSheets(projectId) {
	const sheets = await findByProjectId(projectId);
	for (let i = 0; i < sheets.length; i++) {
		if (sheets[i].ord !== i) {
			await db.query('UPDATE sheet SET ord = ? WHERE id = ?', [i, sheets[i].id]);
		}
	}
}

module.exports = {
	create,
	del,
	findById,
	findByProjectId,
	findByProjectIdAndOrder,
	update
};
