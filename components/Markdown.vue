<script setup lang="ts">
import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';

// single newlines in the legal notices and help texts separate definitions,
// address lines and enumerations, so they must render as line breaks
const markdownItInstance = markdownIt({ breaks: true, html: true });
markdownItInstance.use(markdownItAttrs);

// wide tables (e.g. the cookie table in the privacy notice) must scroll
// on their own instead of stretching the page on narrow screens
markdownItInstance.renderer.rules.table_open = () => '<div class="table-wrapper"><table>';
markdownItInstance.renderer.rules.table_close = () => '</table></div>';

const props = defineProps<{
	md: string;
}>();

const html = computed(() => markdownItInstance.render(props.md));
</script>

<template>
	<!-- eslint-disable vue/no-v-html -->
	<div
		class="md"
		v-html="html"
	/>
</template>
