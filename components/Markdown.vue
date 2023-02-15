<template>
	<!-- eslint-disable-next-line vue/no-v-html -->
	<div
		class="md"
		v-html="html"
	/>
</template>

<script>
const md = require('markdown-it')({ html: true });
const markdownItAttrs = require('markdown-it-attrs');

md.use(markdownItAttrs);

export default {
	props: {
		md: {
			type: String,
			default: '',
		},
	},
	computed: {
		html() {
			return md.render(this.md);
		},
	},
};
</script>
