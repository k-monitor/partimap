import en from './en-terms.md?raw';
import de from './de-terms.md?raw';
import hu from './hu-terms.md?raw';

export default function getTermsContent(locale: string) {
	if (locale === 'de') return de;
	if (locale === 'hu') return hu;
	return en;
}
