const fs = require('fs');
const fileType = require('file-type');
const { StatusCodes } = require('http-status-codes');
const multer = require('multer');
const fetch = require('node-fetch');
const sharp = require('sharp');
const { RECAPTCHA_SECRET_KEY } = require('../conf');

/**
 * @param {Function} dirFromReq Receives `req`, should return a directory name
 * @param {Number} width Desired maximum width of image
 * @param {Number} height Desired maximum height of image
 * @param {String} field Image relative URL will be put into `req` under this field name
 * @returns {Array} List of middlewares
 */
function acceptImage(dirFromReq, width, height, field) {
	const FILE_SIZE_LIMIT_MB = 5;
	const ACCEPTED_FORMATS = [
		'image/jpeg',
		'image/jpg',
		'image/png',
		'image/webp',
	];
	return [
		// accept uploaded image
		multer({ storage: multer.memoryStorage() }).single('image'),

		// validate uploaded image's file size and format
		async (req, res, next) => {
			if (req.file.size > FILE_SIZE_LIMIT_MB * 1024 * 1024) {
				return res.sendStatus(StatusCodes.BAD_REQUEST);
			}
			const meta = await fileType.fromBuffer(req.file.buffer);
			if (!ACCEPTED_FORMATS.includes(meta.mime)) {
				return res.sendStatus(StatusCodes.BAD_REQUEST);
			}
			next();
		},

		// optimize and store uploaded image
		async (req, _res, next) => {
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
		},
	];
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

/**
 * @param {Function} condition If present it is used to determine if validation is necessary. The request will be passed as an argument.
 * @returns Captcha validator middleware.
 */
function validateCaptcha(condition) {
	return async (req, res, next) => {
		const needValidation = !condition || condition(req);
		if (needValidation) {
			const u = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${req.body.captcha}`;
			const crs = await fetch(u);
			const cr = await crs.json();
			if (!cr.success) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ error: 'CAPTCHA_INVALID' });
			}
		}
		next();
	};
}

module.exports = {
	acceptImage,
	resolveRecord,
	validateCaptcha,
};
