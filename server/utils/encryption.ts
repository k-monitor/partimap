import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';

const PATH = process.env.ENCRYPTION_KEY_PATH || './encryption.key';

const ALGO = 'aes-256-gcm';
const KEY = Buffer.from(readFileSync(PATH, 'utf8').trim(), 'base64');

export function encryptField(plaintext: string) {
	if (!plaintext.trim()) return '';
	const iv = crypto.randomBytes(12);
	const cipher = crypto.createCipheriv(ALGO, KEY, iv);
	const encrypted = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
	const authTag = cipher.getAuthTag();
	return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

export function decryptField(stored: string) {
	if (!stored.trim()) return '';
	const data = Buffer.from(stored, 'base64');
	const iv = data.subarray(0, 12);
	const authTag = data.subarray(12, 28);
	const encrypted = data.subarray(28);
	const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
	decipher.setAuthTag(authTag);
	return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}
