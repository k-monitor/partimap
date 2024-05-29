import fs from 'fs';
import path from 'path';
import { fileTypeFromBuffer } from 'file-type';
import { H3Event } from 'h3';
import { StatusCodes } from 'http-status-codes';
import multer from 'multer';
import copy from 'recursive-copy';
import { rimrafSync as rmrf } from 'rimraf';
import sharp from 'sharp';

const ACCEPTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const FILE_SIZE_LIMIT_MB = 5;
const UPLOADS_DIR_NAME = 'uploads';

function resolveRoot() {
	return path.resolve(process.cwd());
}

export function ensureUploadsDirectoryExists() {
	const root = resolveRoot();
	const subdir = path.join(root, UPLOADS_DIR_NAME);
	if (!fs.existsSync(subdir)) {
		console.log('Creating uploads directory:', subdir);
		fs.mkdirSync(subdir);
	}
	if (!fs.existsSync(subdir)) {
		throw new Error('Could not create uploads directory: ' + subdir);
	}
	console.log('Uploads directory: ', subdir);
}

export async function acceptImage(
	event: H3Event,
	directory: string,
	targetWidth: number,
	targetHeight: number,
) {
	const upload = multer({ storage: multer.memoryStorage() }).single('image');
	await callNodeListener(upload as any, event.node.req, event.node.res);

	const req = event.node.req as any;

	if (req.file.size > FILE_SIZE_LIMIT_MB * 1024 * 1024) {
		throw createError({
			message: 'FILE_TOO_BIG',
			status: StatusCodes.BAD_REQUEST,
		});
	}
	const meta = await fileTypeFromBuffer(req.file.buffer);
	if (!ACCEPTED_FORMATS.includes(meta?.mime || '')) {
		throw createError({
			message: 'INVALID_FORMAT',
			status: StatusCodes.BAD_REQUEST,
		});
	}

	const root = resolveRoot();

	const subdir = path.join(root, UPLOADS_DIR_NAME, directory);
	if (!fs.existsSync(subdir)) fs.mkdirSync(subdir);

	// /uploads/u/123456789.jpg
	const url = '/' + path.join(UPLOADS_DIR_NAME, directory, `${new Date().getTime()}.jpg`);

	// /path/to/server/uploads/u/123456789.jpg
	const fn = path.join(root, url);

	let image = sharp(req.file.buffer);
	const metadata = await image.metadata();
	const width = metadata?.width || 0;
	const height = metadata?.height || 0;
	if (width > targetWidth || height > targetHeight) {
		image = image.resize(targetWidth, targetHeight, { fit: 'inside' });
	}
	await image.jpeg({ mozjpeg: true }).toFile(fn);

	return url; // returning file URL that can be stored and used on frontend
}

export async function cloneImages(sourceDir: string, targetDir: string) {
	const root = resolveRoot();
	const s = path.join(root, UPLOADS_DIR_NAME, sourceDir);
	const t = path.join(root, UPLOADS_DIR_NAME, targetDir);
	if (fs.existsSync(s)) await copy(s, t);
}

export function deleteImageFile(url: string | null) {
	if (!url) return;
	const root = resolveRoot();
	const fn = path.join(root, url);
	if (fs.existsSync(fn)) fs.unlinkSync(fn);
}

export function deleteImages(directory: string) {
	const root = resolveRoot();
	const subdir = path.join(root, UPLOADS_DIR_NAME, directory);
	rmrf(subdir);
}
