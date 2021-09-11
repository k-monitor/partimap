const fs = require('fs');
const fileType = require('file-type');
const { StatusCodes } = require('http-status-codes');
const multer = require('multer');
const sharp = require('sharp');

const acceptImage = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024
	}
}).single('image');

function storeOptimizedImage(dirFromReq, width, height, field) {
	return async (req, _res, next) => {
		const dir = `./uploads/${dirFromReq(req)}`;
		const fn = `${dir}/${new Date().getTime()}.jpg`;
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
		let image = sharp(req.file.buffer);
		const metadata = await image.metadata();
		if (metadata.width > width || metadata.height > height) {
			image = image.resize(width, height, { fit: 'inside' });
		}
		await image.jpeg({ mozjpeg: true }).toFile(fn);
		req[field] = fn;
		next();
	};
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

function resolveRecord(idFromReq, findById, field, optional) {
	return async (req, res, next) => {
		const id = idFromReq(req);
		if (!id && !optional) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}

		field = field || 'record';
		req[field] = await findById(id);
		if (!req[field] && !optional) {
			return res.sendStatus(StatusCodes.NOT_FOUND);
		}
		next();
	};
}

module.exports = {
	acceptImage,
	resolveRecord,
	storeOptimizedImage,
	validateImage
};
