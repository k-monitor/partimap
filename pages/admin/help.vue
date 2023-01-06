<template>
	<AdminFrame>
		<template #header>
			{{ $t('adminHelp.title') }}
		</template>

		<Markdown class="help mb-5" :md="$t('adminHelp.content')" />
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
