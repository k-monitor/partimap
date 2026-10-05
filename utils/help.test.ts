import { describe, expect, it } from 'vitest';
import { highlightHelpMatches, loadHelpSections, searchHelp } from './help';

const hu = await loadHelpSections('hu');
const en = await loadHelpSections('en');

describe('loadHelpSections', () => {
	it('takes section titles from the intros', () => {
		expect(hu.find((s) => s.slug === 'keszites')?.title).toBe('Segítség kérdőív készítőknek');
		for (const section of [...hu, ...en]) {
			expect(section.title).not.toBe('');
			expect(section.intro).not.toMatch(/^#/);
			expect(section.pages.length).toBeGreaterThan(0);
		}
	});

	it('loads translations with the same page slugs', () => {
		expect(en.map((s) => s.title)).not.toEqual(hu.map((s) => s.title));
		const slugs = (sections: typeof hu) => sections.map((s) => s.pages.map((p) => p.slug));
		expect(slugs(en)).toEqual(slugs(hu));
	});

	it('falls back to English for languages without a translation', async () => {
		expect(await loadHelpSections('xx')).toEqual(en);
	});
});

describe('searchHelp', () => {
	it('returns nothing for an empty query', () => {
		expect(searchHelp(hu, '')).toEqual([]);
		expect(searchHelp(hu, '   ')).toEqual([]);
	});

	it('finds pages by title', () => {
		const hits = searchHelp(hu, 'regisztráció');
		expect(hits.length).toBeGreaterThan(0);
		expect(hits[0].page.slug).toBe('regisztracio');
		expect(hits[0].section.slug).toBe('keszites');
	});

	it('ignores accents and case', () => {
		const hits = searchHelp(hu, 'REGISZTRACIO');
		expect(hits[0].page.slug).toBe('regisztracio');
	});

	it('requires every term to match', () => {
		expect(searchHelp(hu, 'kérdőív').length).toBeGreaterThan(1);
		expect(searchHelp(hu, 'kérdőív zsiráfbukfenc')).toEqual([]);
	});

	it('ranks title matches before body-only matches', () => {
		const hits = searchHelp(hu, 'térkép');
		const inTitle = hits.map((h) => h.page.title.toLowerCase().includes('térkép'));
		expect(inTitle).toContain(true);
		expect(inTitle).toContain(false);
		expect(inTitle.lastIndexOf(true)).toBeLessThan(inTitle.indexOf(false));
	});

	it('searches the given language', () => {
		expect(searchHelp(en, 'regisztráció')).toEqual([]);
		expect(searchHelp(en, 'registration')[0].page.slug).toBe('regisztracio');
	});

	it('excerpts around the match without Markdown syntax', () => {
		const [hit] = searchHelp(hu, 'regisztráció');
		expect(hit.excerpt.length).toBeLessThan(200);
		expect(hit.excerpt).not.toMatch(/[#*`]|!\[/);
	});
});

describe('highlightHelpMatches', () => {
	it('splits text around matches', () => {
		expect(highlightHelpMatches('a kérdőív neve', 'kérdőív')).toEqual([
			{ text: 'a ', match: false },
			{ text: 'kérdőív', match: true },
			{ text: ' neve', match: false },
		]);
	});

	it('matches accented text with an unaccented query', () => {
		const parts = highlightHelpMatches('Kérdőív', 'kerdoiv');
		expect(parts).toEqual([{ text: 'Kérdőív', match: true }]);
	});

	it('ignores the accents of every supported language', () => {
		const parts = highlightHelpMatches(
			'Întrebări și răspunsuri, klausimų žemėlapį',
			'intrebari si klausimu zemelapi',
		);
		expect(parts.filter((p) => p.match).map((p) => p.text)).toEqual([
			'Întrebări',
			'și',
			'klausimų',
			'žemėlapį',
		]);
	});

	it('highlights every term of the query', () => {
		const parts = highlightHelpMatches('térkép és kérdőív', 'kérdőív térkép');
		expect(parts.filter((p) => p.match).map((p) => p.text)).toEqual(['térkép', 'kérdőív']);
	});

	it('leaves text alone for an empty query', () => {
		expect(highlightHelpMatches('valami', '')).toEqual([{ text: 'valami', match: false }]);
	});
});
