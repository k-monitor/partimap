<script setup lang="ts">
defineI18nRoute({
	paths: {
		en: '/how-it-works',
		es: '/guia-del-usuario',
		lt: '/naudojimosi-instrukcija',
	},
});

const { currentRoute } = useRouter();
const params = Object.keys(currentRoute.value.query);

const { t } = useI18n();

useHead({
	title: t('help.title'),
});

const editorsHelp = await useMessageFromDatabase('editorsHelp');
const visitorsHelp = await useMessageFromDatabase('visitorsHelp');
</script>

<template>
	<PublicFrame>
		<div class="container my-5 help">
			<header class="my-5">
				<h1 class="border-bottom">{{ $t('help.title') }}</h1>
			</header>

			<Markdown
				class="help mb-5"
				:md="visitorsHelp || ''"
			/>

			<Markdown
				v-if="!params.includes('visitor')"
				class="help mb-5"
				:md="editorsHelp || ''"
			/>
		</div>
	</PublicFrame>
</template>
