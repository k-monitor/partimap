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

const { errorToast, successToast } = useToasts();

async function save() {
	try {
		await $fetch(`/api/project/${project.value.id}/quiz`, {
			method: 'PATCH',
			body: { quizMode: quizMode.value },
		});
		successToast('Kvíz mód módosításai elmentve.');
	} catch {
		errorToast('Nem sikerült menteni a kvíz mód módosításait.');
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
						A módosítások csak akkor lépnek életbe, ha az alábbi Mentés gombra
						kattintasz, vagy ha a beviteli mezőben Enter-t ütsz.
					</p>
					<p class="card-text">Ez a funkció csak adminoknak elérhető.</p>
				</div>
				<div class="card-footer">
					<div class="d-flex justify-content-end">
						<button
							class="btn btn-success"
							type="submit"
						>
							Mentés
						</button>
					</div>
				</div>
			</div>
		</div>
	</form>
</template>
