import { describe, expect, it } from 'vitest';
import { highlightHelpMatches, searchHelp } from './help';

describe('searchHelp', () => {
	it('returns nothing for an empty query', () => {
		expect(searchHelp('')).toEqual([]);
		expect(searchHelp('   ')).toEqual([]);
	});

	it('finds pages by title', () => {
		const hits = searchHelp('regisztráció');
		expect(hits.length).toBeGreaterThan(0);
		expect(hits[0].page.slug).toBe('regisztracio');
		expect(hits[0].section.slug).toBe('keszites');
	});

	it('ignores accents and case', () => {
		const hits = searchHelp('REGISZTRACIO');
		expect(hits[0].page.slug).toBe('regisztracio');
	});

	it('requires every term to match', () => {
		expect(searchHelp('kérdőív').length).toBeGreaterThan(1);
		expect(searchHelp('kérdőív zsiráfbukfenc')).toEqual([]);
	});

	it('ranks title matches before body-only matches', () => {
		const hits = searchHelp('térkép');
		const inTitle = hits.map((h) => h.page.title.toLowerCase().includes('térkép'));
		expect(inTitle).toContain(true);
		expect(inTitle).toContain(false);
		expect(inTitle.lastIndexOf(true)).toBeLessThan(inTitle.indexOf(false));
	});

	it('excerpts around the match without Markdown syntax', () => {
		const [hit] = searchHelp('regisztráció');
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

	it('highlights every term of the query', () => {
		const parts = highlightHelpMatches('térkép és kérdőív', 'kérdőív térkép');
		expect(parts.filter((p) => p.match).map((p) => p.text)).toEqual(['térkép', 'kérdőív']);
	});

	it('leaves text alone for an empty query', () => {
		expect(highlightHelpMatches('valami', '')).toEqual([{ text: 'valami', match: false }]);
	});
});
