<script setup lang="ts">
const props = defineProps<{
	projectDataProcessor?: string;
}>();

const { t } = useI18n();

const md = computed(() => {
	return t('Terms.content').replace(
		'$_PROJECT_DATA_PROCESSOR_$',
		props.projectDataProcessor || '',
	);
});
</script>

<template>
	<Markdown
		class="terms"
		:md="md"
	/>
</template>

<style>
.terms h1,
.terms h2 {
	font-size: 1.1rem;
	font-weight: bold;
}

.terms h2 {
	margin-top: 2rem;
}
</style>
