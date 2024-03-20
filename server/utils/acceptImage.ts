import fs from 'fs';
import path from 'path';
import { fileTypeFromBuffer } from 'file-type';
import { H3Event } from 'h3';
import { StatusCodes } from 'http-status-codes';
import multer from 'multer';
import sharp from 'sharp';

export async function acceptImage(
	event: H3Event,
	directory: string,
	targetWidth: number,
	targetHeight: number,
) {
	const FILE_SIZE_LIMIT_MB = 5;
	const ACCEPTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

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

	const root = path.resolve(process.cwd());

	const subdir = path.join(root, 'uploads', directory);
	if (!fs.existsSync(subdir)) fs.mkdirSync(subdir);

	// /uploads/u/123456789.jpg
	const url = path.join('/uploads', directory, `${new Date().getTime()}.jpg`);

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
