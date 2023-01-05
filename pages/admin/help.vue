<template>
	<AdminFrame>
		<template #header>
			{{ $t('adminHelp.title') }}
		</template>

		<AdminHelpContent />
	</AdminFrame>
</template>

<script>
export default {
	head() {
		return {
			title: this.$t('adminHelp.title'),
		};
	},
};
</script>
