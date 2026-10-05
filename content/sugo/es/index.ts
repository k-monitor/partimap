// The guide in this language, loaded as one chunk by `utils/help.ts`.
export default import.meta.glob('./**/*.md', {
	eager: true,
	import: 'default',
	query: '?raw',
}) as Record<string, string>;
