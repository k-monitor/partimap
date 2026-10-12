export function stripHtml(html: string) {
	return html.replace(/<[^>]*>/g, '').trim();
}
