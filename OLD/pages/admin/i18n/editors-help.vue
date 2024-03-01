<template>
	<HelpEditor
		:title="$t('AdminFrame.editEditorsHelp')"
		value-key="editorsHelp"
	/>
</template>

<script>
export default {
	middleware: ['auth', 'admin'],
	head() {
		return {
			title: `Admin: ${this.$t('AdminFrame.editEditorsHelp')}`,
		};
	},
};
</script>
