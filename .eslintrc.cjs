module.exports = {
	root: true,
	extends: ['@nuxt/eslint-config', 'prettier'],
	rules: {
		'vue/component-tags-order': ['error', { order: ['script', 'template', 'style'] }],
		'vue/multi-word-component-names': 'warn',
		'vue/padding-line-between-blocks': ['error', 'always'],
	},
};
