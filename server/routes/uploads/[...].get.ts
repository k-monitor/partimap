import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import path from 'path';

export default defineEventHandler(async (event) => {
	const baseDir = path.resolve(process.cwd());
	const file = path.resolve(baseDir, 'uploads', event.context.params?._ || '');
	if (!file.startsWith(baseDir + path.sep)) {
		throw createError({ status: StatusCodes.NOT_FOUND });
	}
	return sendStream(event, fs.createReadStream(file));
});
