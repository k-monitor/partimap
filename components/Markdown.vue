<script setup lang="ts">
import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';

const markdownItInstance = markdownIt({ html: true });
markdownItInstance.use(markdownItAttrs);

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
