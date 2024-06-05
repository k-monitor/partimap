import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import path from 'path';

export default defineEventHandler(async (event) => {
	const file = path.resolve(process.cwd(), 'uploads', event.context.params?._ || '');
	if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
		throw createError({ status: StatusCodes.NOT_FOUND });
	}
	return sendStream(event, fs.createReadStream(file));
});
