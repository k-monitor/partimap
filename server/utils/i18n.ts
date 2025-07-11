import en from '~/locales/en-server';
import es from '~/locales/es-server';
import hu from '~/locales/hu-server';
import lt from '~/locales/lt-server';
import de from '~/locales/de-server';

export default function (locale: string) {
	if (locale === 'es') return es;
	if (locale === 'hu') return hu;
	if (locale === 'lt') return lt;
	if (locale === 'de') return de;
	return en;
}
