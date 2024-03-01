<template>
	<Markdown
		class="terms"
		:md="md"
	/>
</template>

<script>
export default {
	props: {
		projectDataProcessor: {
			type: String,
			default: '',
		},
	},
	computed: {
		md() {
			return this.$t('Terms.content').replace(
				'$_PROJECT_DATA_PROCESSOR_$',
				this.projectDataProcessor
			);
		},
	},
};
</script>

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
