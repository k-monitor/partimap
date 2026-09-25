# locales

## Adding a locale

- copy `en-*` files prefixed the new language code
- replace texts with translations
- copy `/content/sugo/en` (the Súgó) to `/content/sugo/<code>` and translate it, keeping the file names
- add locale in `/server/utils/i18n.ts`
- add locale in `/i18n/i18n.config.ts`
- add localte in `/nuxt.config.ts`
