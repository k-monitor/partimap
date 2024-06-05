module.exports = {
	root: true,
	extends: ['@nuxt/eslint-config', 'prettier'],
	overrides: [
		{
			files: ['pages/**/*.vue'],
			rules: {
				'vue/multi-word-component-names': 'off',
			},
		},
	],
	rules: {
		'vue/component-tags-order': ['error', { order: ['script', 'template', 'style'] }],
		'vue/multi-word-component-names': 'off',
		'vue/padding-line-between-blocks': ['error', 'always'],
	},
};
