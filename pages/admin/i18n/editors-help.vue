<script setup lang="ts">
definePageMeta({
	middleware: ['admin'],
});

const { t } = useI18n();

useHead({
	title: `Admin: ${t('AdminFrame.editVisitorsHelp')}`,
});
</script>

<template>
	<HelpEditor
		:title="$t('AdminFrame.editEditorsHelp')"
		value-key="editorsHelp"
	/>
</template>
