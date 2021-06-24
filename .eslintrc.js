module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	parserOptions: {
		parser: 'babel-eslint'
	},
	extends: [
		'@nuxtjs',
		'plugin:nuxt/recommended'
	],
	plugins: [
	],
	// add your custom rules here
	rules: {
		'arrow-parens': ['error', 'as-needed'],
		'comma-dangle': 0,
		indent: ['error', 'tab'],
		'no-tabs': ['error', { allowIndentationTabs: true }],
		semi: ['error', 'always'],
		'space-before-function-paren': 0,
		'vue/html-indent': ['error', 'tab'],
		'vue/singleline-html-element-content-newline': 0
	}
};
