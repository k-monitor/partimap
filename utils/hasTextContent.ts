export function hasTextContent(html: string | null | undefined): boolean {
	if (!html) return false;
	return html.replace(/<[^>]*>/g, '').trim().length > 0;
}
