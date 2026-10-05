export function optionLabel(o: string | { label: string; image: string }): string {
	return typeof o === 'string' ? o : o.label;
}
