<script setup lang="ts">
import type { Project } from '~/server/data/projects';

const props = defineProps<{
	project: Project;
}>();
const project = toRef(props, 'project');

const quizMode = ref(project.value.quizMode || 0);

const enabled = ref(project.value.quizMode > 0);
watch(enabled, (val) => (quizMode.value = val ? 1 : 0));

const { errorToast, successToast } = useToasts();

const { t } = useI18n();

async function save() {
	try {
		await $fetch(`/api/project/${project.value.id}/quiz`, {
			method: 'PATCH',
			body: { quizMode: quizMode.value },
		});
		successToast(t('projectEditor.changeSuccessful'));
	} catch {
		errorToast(t('changeFailed'));
	}
}
</script>

<template>
	<form @submit.prevent="save">
		<div class="container mb-5">
			<div class="card shadow-sm">
				<h4 class="card-header">Kvíz mód</h4>
				<div class="card-body">
					<b-form-group>
						<b-form-checkbox v-model="enabled">
							{{ t('ProjectQuizModeEditor.enable') }}
						</b-form-checkbox>
					</b-form-group>
					<b-form-group :label="t('ProjectQuizModeEditor.maxOrd')">
						<b-form-input
							v-model="quizMode"
							:disabled="!enabled"
							max="9999"
							min="0"
							placeholder="1"
							type="number"
							style="width: 100px"
						/>
					</b-form-group>
					<p class="card-text">
						{{ t('ProjectQuizModeEditor.saveInfo') }}
					</p>
					<p class="card-text">{{ t('ProjectQuizModeEditor.adminOnly') }}</p>
				</div>
				<div class="card-footer">
					<div class="d-flex justify-content-end">
						<button
							class="btn btn-success"
							type="submit"
						>
							{{ t('SaveButton.save') }}
						</button>
					</div>
				</div>
			</div>
		</div>
	</form>
</template>
