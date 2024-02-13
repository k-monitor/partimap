<template>
	<HelpEditor
		:title="$t('AdminFrame.editVisitorsHelp')"
		value-key="visitorsHelp"
	/>
</template>

<script>
export default {
	middleware: ['auth', 'admin'],
	head() {
		return {
			title: `Admin: ${this.$t('AdminFrame.editVisitorsHelp')}`,
		};
	},
};
</script>
