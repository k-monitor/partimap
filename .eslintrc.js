module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
	},
	extends: [
		'plugin:vue/recommended',
		'@nuxtjs',
		'plugin:nuxt/recommended',
		'plugin:prettier-vue/recommended',
	],
	ignorePatterns: ['migrations/**'],
	parserOptions: {
		parser: 'babel-eslint',
	},
	plugins: ['vue'],
	rules: {
		indent: ['error', 'tab', { SwitchCase: 1 }],
		'prettier-vue/prettier': [
			'error',
			{
				arrowParens: 'avoid',
				semi: true,
				singleAttributePerLine: true,
				singleQuote: true,
				tabWidth: 4,
				useTabs: true,
			},
		],
	},
};
