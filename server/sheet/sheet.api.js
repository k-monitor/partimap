const fs = require('fs');
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const fileType = require('file-type');
const multer = require('multer');
const sharp = require('sharp');
const Sheet = require('../../model/sheet');
const { ensureLoggedIn, ensureAdminOr } = require('../auth/middlewares');
const { resolveRecord } = require('../common/middlewares');
const pdb = require('../project/project.db');
const sdb = require('./sheet.db');

function acceptImage() {
	return multer({
		storage: multer.memoryStorage(),
		// TODO filter by file format (magic number)
		limits: {
			fileSize: 5 * 1024 * 1024
		}
	}).single('image');
}

async function validateImage(req, res, next) {
	const whitelist = [
		'image/jpeg',
		'image/jpg',
		'image/png',
		'image/webp'
	];
	const meta = await fileType.fromBuffer(req.file.buffer);
	if (!whitelist.includes(meta.mime)) {
		res.sendStatus(StatusCodes.BAD_REQUEST);
	} else {
		next();
	}
}

router.put('/sheet/:id/image',
	// TODO ensureLoggedIn,
	resolveRecord(req => req.params.id, sdb.findById, 'sheet'),
	resolveRecord(req => req.sheet.projectId, pdb.findById, 'project'),
	// TODO ensureAdminOr(req => req.project.userId === req.user.id),
	acceptImage(),
	validateImage,
	async (req, res) => {
		const dir = `./uploads/${req.project.id}`;
		const fn = `${dir}/${new Date().getTime()}.jpg`;
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
		await sharp(req.file.buffer)
			.jpeg({ mozjpeg: true })
			.toFile(fn);

		// TODO sharp resize
		// TODO sharp optimize and save
		// TODO remove previous image file if defined in sheet record
		// TODO save filename into sheet record
		// TODO return sheet record
		res.end();
	});

router.delete('/sheet/:id',
	ensureLoggedIn,
	resolveRecord(req => req.params.id, sdb.findById, 'sheet'),
	resolveRecord(req => req.sheet.projectId, pdb.findById, 'project'),
	ensureAdminOr(req => req.project.userId === req.user.id),
	async (req, res) => {
		await sdb.del(req.params.id);
		// TODO delete image file if exists
		res.json({});
	});

router.get('/project/:id/sheets',
	resolveRecord(req => req.params.id, pdb.findById, 'project'),
	async (req, res) => {
		const sheets = await sdb.findByProjectId(req.params.id);
		res.json(sheets);
	});

router.get('/project/:id/sheet/:ord',
	resolveRecord(req => req.params.id, pdb.findById, 'project'),
	async (req, res) => {
		const sheet = await sdb.findByProjectIdAndOrder(req.params.id, req.params.ord);
		if (!sheet) {
			return res.sendStatus(StatusCodes.NOT_FOUND);
		}
		res.json(sheet);
	});

router.get('/sheet/:id',
	resolveRecord(req => req.params.id, sdb.findById, 'sheet'),
	(req, res) => res.json(req.sheet));

router.patch('/sheet',
	ensureLoggedIn,
	resolveRecord(req => req.body.id, sdb.findById, 'sheet'),
	resolveRecord(req => req.sheet.projectId, pdb.findById, 'project'),
	ensureAdminOr(req => req.project.userId === req.user.id),
	async (req, res) => {
		const changes = req.body;
		delete changes.projectId;

		let sheet = new Sheet(Object.assign(req.sheet, changes));
		if (!sheet.title) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}
		await sdb.update(sheet);

		sheet = await sdb.findById(sheet.id);
		res.json(sheet);
	});

router.put('/project/:id/sheet',
	ensureLoggedIn,
	resolveRecord(req => req.params.id, pdb.findById, 'project'),
	ensureAdminOr(req => req.project.userId === req.user.id),
	async (req, res) => {
		let sheet = new Sheet(req.body);
		sheet.projectId = req.params.id;
		if (!sheet.title) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}

		const id = await sdb.create(sheet);
		sheet = await sdb.findById(id);

		res.json(sheet);
	});

module.exports = router;
