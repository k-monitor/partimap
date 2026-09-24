import { ensureUploadsDirectoryExists } from '~/server/utils/uploads';

export default defineNitroPlugin(() => {
	if (process.env.VERCEL) return; // read-only filesystem, uploads are unsupported

	ensureUploadsDirectoryExists();
});
