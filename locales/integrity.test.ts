import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import hu from './hu';
import huServer from './hu-server';

function enumerateKeys(obj: Record<string, unknown> | string, prefix = ''): string[] {
	if (typeof obj === 'string') return [];
	const keys: string[] = [];
	for (const key in obj) {
		const value = obj[key];
		const fullKey = prefix ? `${prefix}.${key}` : key;
		if (value && typeof value === 'object' && !Array.isArray(value)) {
			keys.push(...enumerateKeys(value as Record<string, unknown>, fullKey));
		} else {
			keys.push(fullKey);
		}
	}
	return keys;
}
const uiMessageKeys = enumerateKeys(hu);
const serverMessageKeys = enumerateKeys(huServer);

function enumerateLocaleFiles(): string[] {
	const dir = path.join(__dirname, '.');
	const files: string[] = [];
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (
			entry.isFile() &&
			entry.name.match(/^[a-z]{2}(-server)?\.js$/) &&
			!entry.name.startsWith('hu')
		) {
			files.push(fullPath);
		}
	}
	return files;
}
const messageFiles = enumerateLocaleFiles();
const uiMessageFiles = messageFiles.filter((file) => !file.includes('-server'));
const serverMessageFiles = messageFiles.filter((file) => file.includes('-server'));

async function describeMessageFile(file: string, expectedKeys: string[]) {
	const { default: messages } = await import(file);
	const name = path.basename(file, '.js');
	const keys = enumerateKeys(messages);
	const missingKeys = expectedKeys.filter((key) => !keys.includes(key));
	const extraKeys = keys.filter((key) => !expectedKeys.includes(key));
	describe(`Integrity of locales/${name}`, () => {
		it('should have all keys defined', () => {
			expect(missingKeys).toEqual([]);
		});
		it('should not have extra keys', () => {
			expect(extraKeys).toEqual([]);
		});
	});
}
for (const file of uiMessageFiles) {
	await describeMessageFile(file, uiMessageKeys);
}
for (const file of serverMessageFiles) {
	await describeMessageFile(file, serverMessageKeys);
}
