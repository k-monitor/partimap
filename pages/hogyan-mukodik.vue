<template>
	<PublicFrame>
		<div class="container my-5 help">
			<header class="my-5">
				<h1 class="border-bottom">{{ $t('help.title') }}</h1>
			</header>

			<Markdown class="help mb-5" :md="$t('help.content')" />

			<Markdown class="help mb-5" :md="$t('adminHelp.content')" />
		</div>
	</PublicFrame>
</template>

<script>
export default {
	head() {
		return {
			title: this.$t('help.title'),
		};
	},
	nuxtI18n: {
		paths: {
			en: '/how-it-works',
		},
	},
};
</script>
