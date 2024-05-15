<script setup lang="ts">
const { t } = useI18n();

useHead({
	title: t('adminHelp.title'),
});

const editorsHelp = await useMessageFromDatabase('editorsHelp');
</script>

<template>
	<AdminFrame>
		<template #header>
			{{ $t('adminHelp.title') }}
		</template>

		<Markdown
			class="help mb-5"
			:md="editorsHelp"
		/>
	</AdminFrame>
</template>
