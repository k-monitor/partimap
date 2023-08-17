<template>
	<PublicFrame>
		<div class="container my-5 help">
			<header class="my-5">
				<h1 class="border-bottom">{{ $t('help.title') }}</h1>
			</header>

			<Markdown
				class="help mb-5"
				:md="visitorsHelp.value"
			/>

			<Markdown
				class="help mb-5"
				:md="editorsHelp.value"
			/>
		</div>
	</PublicFrame>
</template>

<script>
export default {
	async asyncData({ $axios, i18n }) {
		const lang = i18n.locale;
		const editorsHelp = await $axios.$get(
			`/api/i18n/get/${lang}/editorsHelp`
		);
		const visitorsHelp = await $axios.$get(
			`/api/i18n/get/${lang}/visitorsHelp`
		);
		return { editorsHelp, visitorsHelp };
	},
	head() {
		return {
			title: this.$t('help.title'),
		};
	},
	nuxtI18n: {
		paths: {
			en: '/how-it-works',
			es: '/guia-del-usuario',
		},
	},
};
</script>
