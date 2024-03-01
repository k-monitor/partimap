<template>
	<AdminFrame>
		<template #header>
			{{ $t('adminHelp.title') }}
		</template>

		<Markdown
			class="help mb-5"
			:md="editorsHelp.value"
		/>
	</AdminFrame>
</template>

<script>
export default {
	async asyncData({ $axios, i18n }) {
		const lang = i18n.locale;
		const editorsHelp = await $axios.$get(
			`/api/i18n/get/${lang}/editorsHelp`
		);
		return { editorsHelp };
	},
	head() {
		return {
			title: this.$t('adminHelp.title'),
		};
	},
};
</script>
