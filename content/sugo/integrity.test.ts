import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

// Translations of the Súgó must keep the structure of the Hungarian original:
// the same files (their names are the page slugs), a title on the first line
// of every file and the same images.
const SOURCE_LOCALE = 'hu';

function listLocales(dir: string) {
	return fs
		.readdirSync(dir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.sort();
}

function listFiles(locale: string) {
	const dir = path.join(__dirname, locale);
	return (fs.readdirSync(dir, { recursive: true }) as string[])
		.filter((file) => file.endsWith('.md'))
		.sort();
}

function read(locale: string, file: string) {
	return fs.readFileSync(path.join(__dirname, locale, file), 'utf8');
}

function imageSources(md: string) {
	return Array.from(md.matchAll(/<img[^>]*\ssrc="([^"]*)"/g), (match) => match[1]);
}

const locales = listLocales(__dirname);
const sourceFiles = listFiles(SOURCE_LOCALE);

it('is translated to every UI language', () => {
	const uiLocales = fs
		.readdirSync(path.join(__dirname, '../../locales'))
		.filter((file) => /^[a-z]{2}\.js$/.test(file))
		.map((file) => file.slice(0, 2))
		.sort();
	expect(locales).toEqual(uiLocales);
});

describe.each(locales)('%s', (locale) => {
	it('is bundled', () => {
		expect(fs.existsSync(path.join(__dirname, locale, 'index.ts'))).toBe(true);
	});

	it('has the same files as the original', () => {
		expect(listFiles(locale)).toEqual(sourceFiles);
	});

	it.each(sourceFiles)('%s has a title and the original images', (file) => {
		const md = read(locale, file);
		expect(md).toMatch(/^# \S/);
		expect(imageSources(md)).toEqual(imageSources(read(SOURCE_LOCALE, file)));
		if (locale !== SOURCE_LOCALE) {
			expect(md).not.toMatch(/\]\(\/hu\/|href="\/hu\//);
		}
	});
});
