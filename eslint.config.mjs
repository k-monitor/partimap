// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt([
	{
		// Note: there should be no other properties in this object
		ignores: ['**/migrations/*'],
	},
	{
		rules: {
			'no-var': 'error',
			'prefer-const': 'error',
			'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
			'vue/html-self-closing': 'off',
			'vue/multi-word-component-names': 'off',
			'vue/padding-line-between-blocks': ['error', 'always'],
		},
	},
]);
