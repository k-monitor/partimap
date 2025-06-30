import { v4 as uuid } from 'uuid';
import type { User } from '~/server/data/users';

export function addToken(user: User) {
	user.token = uuid();
	user.tokenExpires = new Date().getTime() + 24 * 60 * 60 * 1000;
}
