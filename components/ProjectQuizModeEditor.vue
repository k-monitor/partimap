<script setup lang="ts">
// TODO quiz mode i18n?

import type { Project } from '~/server/data/projects';

const props = defineProps<{
	project: Project;
}>();
const project = toRef(props, 'project');

const quizMode = ref(project.value.quizMode || 0);

const enabled = ref(project.value.quizMode > 0);
watch(enabled, (val) => (quizMode.value = val ? 1 : 0));

const { errorToast } = useToasts();

async function save() {
	try {
		await $fetch(`/api/project/${project.value.id}/quiz`, {
			method: 'PATCH',
			body: { quizMode: quizMode.value },
		});
	} catch {
		errorToast('Nem sikerült menteni.');
	}
}
</script>

<template>
	<div class="container mb-5">
		<div class="card shadow-sm">
			<h4 class="card-header">Kvíz mód</h4>
			<div class="card-body">
				<b-form-group>
					<b-form-checkbox v-model="enabled">
						Bekapcsolás (új kitöltőknél pár másodpercenként frissülni fog az alábbi
						érték)
					</b-form-checkbox>
				</b-form-group>
				<b-form-group label="Legmagasabb munkalap sorszáma:">
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
					A módosítások csak akkor lépnek életbe, ha az alábbi Mentés gombra kattintasz.
				</p>
				<p class="card-text">Ez a funkció csak szuperadminoknak elérhető.</p>
			</div>
			<div class="card-footer">
				<div class="d-flex justify-content-end">
					<button
						type="button"
						class="btn btn-success"
						@click="save"
					>
						Mentés
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
