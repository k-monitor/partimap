export type QuestionOption = string | { label: string; image: string };

export function optionLabel(o: QuestionOption): string {
	return typeof o === 'string' ? o : o.label;
}
