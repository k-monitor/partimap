# locales

## Adding a locale

- copy `en-*` files prefixed the new language code
- replace texts with translations
- if the new language has `*-terms.md`, add locale in `./terms.md`
- add locale in `/server/utils/i18n.ts`
- add localte in `/nuxt.config.ts`

## Notes on .default.md files

`lang-key.default.md` files are only used as a fallback if the `i18n` database table doesn't have a record with matching `lang` and `key` and non-empty `value`.

These files in the repository are updated manually, and may be out of date compared to what is visible on our production site on <https://www.partimap.eu/>.
