import bcrypt from 'bcryptjs';
import readline from 'readline';
import { findByEmail, findById } from '~/server/data/users';
import { inTransaction } from '~/server/utils/database';
import { decryptField } from '~/server/utils/encryption';

function ask(question: string, muted = false): Promise<string> {
	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
	if (muted) {
		(rl as readline.Interface & { _writeToOutput: (s: string) => void })._writeToOutput = (
			s: string,
		) => {
			if (s === question) process.stdout.write(s);
		};
	}
	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			if (muted) process.stdout.write('\n');
			rl.close();
			resolve(answer);
		});
	});
}

async function main() {
	const actorUserEmail = await ask('Actor email: ');
	const actorUserPassword = await ask('Actor password: ', true);
	const subjectUserId = parseInt(await ask('Subject user ID: '), 10);

	const actorUser = await findByEmail(actorUserEmail);
	if (
		!actorUser ||
		!actorUser.active ||
		!actorUser.password ||
		!bcrypt.compareSync(actorUserPassword, actorUser.password) ||
		!actorUser.isAdmin
	) {
		throw new Error('UNAUTHORIZED');
	}

	await inTransaction(async (tx) => {
		const accessTimestamp = new Date();

		const subjectUser = await findById(subjectUserId);
		if (!subjectUser) {
			throw new Error('NOT FOUND');
		}

		// FIXME add record to audit log about access

		const decryptedFullName = decryptField(subjectUser.eFullName);
		const decryptedAddress = decryptField(subjectUser.eAddress);
		const decryptedBirthDate = decryptField(subjectUser.eBirthDate);
		const decryptedBirthPlace = decryptField(subjectUser.eBirthPlace);

		console.log('Access time:', accessTimestamp.toISOString());
		console.log(`Actor:       #${actorUser.id} (${actorUser.email})`);
		console.log(`Subject:     #${subjectUser.id} (${subjectUser.email})`);
		console.log('Registered: ', new Date(subjectUser.registered).toISOString());
		console.log('Last login: ', new Date(subjectUser.lastLogin).toISOString());
		console.log('Full name:  ', decryptedFullName || subjectUser.name);
		console.log('Address:    ', decryptedAddress);
		console.log('Birth place:', decryptedBirthPlace);
		console.log('Birth date: ', decryptedBirthDate);

		// FIXME query audit logs about modifications and accesses to this user and list them
	});
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
