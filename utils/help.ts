/**
 * Súgó (help) content.
 *
 * The guide is written in Markdown under `content/sugo/<locale>/<section>/`.
 * Every major section of the printed guide is a directory: `_intro.md` holds
 * the section title (its first line, `# Title`) and a short introduction that
 * is repeated on top of each of its subpages, and the numbered files are the
 * subpages themselves. A subpage's first line is its `# Title`, which becomes
 * the sidebar label and the page heading.
 *
 * Hungarian is the original, the other languages are translations that keep
 * its file names, so a page has the same slug (URL hash) in every language.
 */

export type HelpPage = {
	/** URL fragment identifying the page within its section. */
	slug: string;
	title: string;
	/** Markdown body, without the leading title. */
	body: string;
};

export type HelpSection = {
	slug: string;
	title: string;
	/** Nuxt route name of the page rendering this section. */
	route: string;
	/** Markdown shown on top of every subpage of the section. */
	intro: string;
	pages: HelpPage[];
};

const SECTIONS = [
	{ slug: 'kitoltoknek', route: 'sugo-kitoltoknek' },
	{ slug: 'keszites', route: 'sugo-keszites' },
	{ slug: 'elemzes', route: 'sugo-elemzes' },
	{ slug: 'projekt', route: 'sugo-projekt' },
	{ slug: 'kerdoiv', route: 'sugo-kerdoiv' },
	{ slug: 'modszertan', route: 'sugo-modszertan' },
];

/** Used for languages the guide has not been translated to. */
const FALLBACK_LOCALE = 'en';

// Every language is a separate chunk (see `content/sugo/<locale>/index.ts`), so
// visitors only download the guide in the language they read it in.
const bundles = import.meta.glob<Record<string, string>>('../content/sugo/*/index.ts', {
	import: 'default',
});

function bundleOf(locale: string) {
	return bundles[`../content/sugo/${locale}/index.ts`];
}

function splitTitle(raw: string) {
	const lines = raw.split('\n');
	const title = /^#\s+(.+)$/.exec(lines[0].trim());
	return title
		? { title: title[1].trim(), body: lines.slice(1).join('\n').trim() }
		: { title: '', body: raw.trim() };
}

function buildSections(files: Record<string, string>): HelpSection[] {
	return SECTIONS.map((section) => {
		const dir = `./${section.slug}/`;
		const intro = splitTitle(files[`${dir}_intro.md`] || '');
		return {
			...section,
			title: intro.title,
			intro: intro.body,
			pages: Object.keys(files)
				.filter((path) => path.startsWith(dir) && !path.endsWith('_intro.md'))
				.sort()
				.map((path) => ({
					slug: path
						.slice(dir.length)
						.replace(/^\d+-/, '')
						.replace(/\.md$/, ''),
					...splitTitle(files[path]),
				})),
		};
	});
}

const loaded = new Map<string, Promise<HelpSection[]>>();

export function loadHelpSections(locale: string) {
	let sections = loaded.get(locale);
	if (!sections) {
		const load = bundleOf(locale) || bundleOf(FALLBACK_LOCALE);
		sections = load().then(buildSections);
		loaded.set(locale, sections);
	}
	return sections;
}

/**
 * Search
 *
 * Matching is accent insensitive: every letter of a search term also matches
 * its accented variants, so "kerdoiv" finds "kérdőív". Doing this with
 * character classes instead of stripping accents from the content keeps the
 * match positions valid in the original text, which is what highlighting and
 * excerpting need.
 */
const ACCENTS: Record<string, string> = {
	a: 'aáàâãäåąă',
	c: 'cçč',
	e: 'eéèêëęė',
	g: 'gģ',
	i: 'iíìîïį',
	n: 'nñń',
	o: 'oóòôöõő',
	s: 'sśšșş',
	t: 'tțţ',
	u: 'uúùûüűųū',
	y: 'yý',
	z: 'zźž',
};

function termPattern(term: string) {
	return Array.from(term.toLowerCase())
		.map((c) => {
			const variants = ACCENTS[c];
			if (variants) return `[${variants}]`;
			return c.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');
		})
		.join('');
}

function queryRegexes(query: string) {
	return query
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.map((term) => new RegExp(termPattern(term), 'gi'));
}

/** Turns Markdown into a rough plain text, good enough for search excerpts. */
function toPlainText(md: string) {
	return md
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/<[^>]+>/g, ' ')
		.replace(/^[>\-*+\s]*|[#*_`|]/gm, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

export type HelpSearchHit = {
	section: HelpSection;
	page: HelpPage;
	/** Plain text around the first match in the body, or its beginning. */
	excerpt: string;
};

const EXCERPT_LENGTH = 180;

function excerptAround(text: string, regexes: RegExp[]) {
	const index = regexes.reduce((found, re) => {
		if (found >= 0) return found;
		re.lastIndex = 0;
		return re.exec(text)?.index ?? -1;
	}, -1);
	if (index < 0) return text.slice(0, EXCERPT_LENGTH) + (text.length > EXCERPT_LENGTH ? '…' : '');

	// Start a bit before the match, on a word boundary where we can.
	const from = Math.max(0, index - 60);
	const space = from === 0 ? 0 : text.indexOf(' ', from) + 1;
	const start = space > 0 && space <= index ? space : from;
	const end = Math.min(text.length, start + EXCERPT_LENGTH);
	return (start > 0 ? '…' : '') + text.slice(start, end).trim() + (end < text.length ? '…' : '');
}

export function searchHelp(sections: HelpSection[], query: string): HelpSearchHit[] {
	const regexes = queryRegexes(query);
	if (!regexes.length) return [];

	const hits: (HelpSearchHit & { score: number })[] = [];
	for (const section of sections) {
		for (const page of section.pages) {
			const text = toPlainText(page.body);
			const haystack = `${section.title} ${page.title} ${text}`;
			const matchesAll = regexes.every((re) => {
				re.lastIndex = 0;
				return re.test(haystack);
			});
			if (!matchesAll) continue;

			const inTitle = regexes.some((re) => {
				re.lastIndex = 0;
				return re.test(page.title);
			});
			hits.push({
				section,
				page,
				excerpt: excerptAround(text, regexes),
				score: inTitle ? 0 : 1,
			});
		}
	}
	return hits.sort((a, b) => a.score - b.score).map(({ score: _score, ...hit }) => hit);
}

/** Splits `text` into alternating plain and matching parts, for `<mark>`ing. */
export function highlightHelpMatches(text: string, query: string) {
	const patterns = queryRegexes(query).map((re) => re.source);
	if (!patterns.length) return [{ text, match: false }];

	const parts: { text: string; match: boolean }[] = [];
	const re = new RegExp(patterns.join('|'), 'gi');
	let last = 0;
	for (const match of text.matchAll(re)) {
		if (match.index > last) parts.push({ text: text.slice(last, match.index), match: false });
		parts.push({ text: match[0], match: true });
		last = match.index + match[0].length;
	}
	if (last < text.length) parts.push({ text: text.slice(last), match: false });
	return parts;
}
