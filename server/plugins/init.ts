import { ensureUploadsDirectoryExists } from '~/server/utils/uploads';

export default defineNitroPlugin(() => {
	ensureUploadsDirectoryExists();
});
