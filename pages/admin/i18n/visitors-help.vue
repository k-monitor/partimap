<template>
	<HelpEditor
		:title="$t('AdminFrame.editVisitorsHelp')"
		value-key="visitorsHelp"
	/>
</template>

<script>
import HelpEditor from '~/components/HelpEditor.vue';

export default {
	components: { HelpEditor },
	middleware: ['auth', 'admin'],
	head() {
		return {
			title: `Admin: ${this.$t('AdminFrame.editVisitorsHelp')}`,
		};
	},
};
</script>
