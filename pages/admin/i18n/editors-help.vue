<template>
	<HelpEditor
		:title="$t('AdminFrame.editEditorsHelp')"
		value-key="editorsHelp"
	/>
</template>

<script>
import HelpEditor from '~/components/HelpEditor.vue';

export default {
	components: { HelpEditor },
	middleware: ['auth', 'admin'],
	head() {
		return {
			title: `Admin: ${this.$t('AdminFrame.editEditorsHelp')}`,
		};
	},
};
</script>
