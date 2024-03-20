import fs from 'fs';
import { User } from '~/server/data/users';

export function removeUserLogoFile(user: User) {
	if (user.logo) {
		const fn = `.${user.logo}`; // make it relative for server
		if (fs.existsSync(fn)) {
			fs.unlinkSync(fn);
		}
	}
}
