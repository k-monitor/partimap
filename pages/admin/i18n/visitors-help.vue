<script setup lang="ts">
definePageMeta({
	middleware: ['admin'],
});

const { t } = useI18n();

useHead({
	title: `Admin: ${t('AdminFrame.editEditorsHelp')}`,
});
</script>

<template>
	<HelpEditor
		:title="$t('AdminFrame.editVisitorsHelp')"
		value-key="visitorsHelp"
	/>
</template>
