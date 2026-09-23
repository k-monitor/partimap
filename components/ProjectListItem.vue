<script setup lang="ts">
import type { Project } from '~/server/data/projects';
import { hasTextContent } from '~/utils/hasTextContent';

defineProps<{
	project: Project;
	showExportOption?: boolean;
	showTransferOption?: boolean;
}>();

defineEmits<{
	(e: 'clone' | 'del' | 'download' | 'transfer' | 'report'): void;
}>();

const { locale, t } = useI18n();
const localePath = useLocalePath();
const {
	public: { gdprBlockFrom },
} = useRuntimeConfig();
</script>

<template>
	<ListItem
		:lang="project.lang"
		:link="localePath('/admin/project/' + project.id)"
		:show-export-option="showExportOption"
		:show-transfer-option="showTransferOption"
		:title="project.title"
		:user-id="project.userId"
		@clone="$emit('clone')"
		@del="$emit('del')"
		@download="$emit('download')"
		@transfer="$emit('transfer')"
	>
		<span
			v-if="
				!hasTextContent(project.privacyPolicy) ||
				!hasTextContent(project.purposeOfDataCollection)
			"
			v-b-tooltip.hover.bottom
			class="badge text-bg-danger me-2"
			:title="
				t('legal.missingAlert', [
					t('projectEditor.privacyPolicy'),
					t('projectEditor.purposeOfDataCollection'),
					new Date(gdprBlockFrom).toLocaleString(locale),
				])
			"
			>{{ t('legal.missingLabel') }}</span
		>
		<br />
		<template v-if="project.created">
			{{ t('projects.created') }}: {{ new Date(project.created).toLocaleDateString() }},
		</template>
		{{ t('projects.views') }}: {{ project.views }}, {{ t('projects.submissions') }}:
		{{ project.submissions }}
		<a
			v-if="project.submissions"
			href="javascript:void(0)"
			@click="$emit('report')"
			>{{ t('projects.export') }}</a
		>
	</ListItem>
</template>
