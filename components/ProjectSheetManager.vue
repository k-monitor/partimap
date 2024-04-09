<script setup lang="ts">
import { saveAs } from 'file-saver';
import type { Feature as GeoJsonFeature } from 'geojson';
import type { Project } from '~/server/data/projects';
import type { Sheet } from '~/server/data/sheets';
import type { Question } from '~/server/data/surveyAnswers';

const localePath = useLocalePath();

const props = defineProps<{
	project: Project;
}>();
const project = toRef(props, 'project');

const endpoint = computed(() => `/api/sheet/${project.value.id}/sheets`);
const { data: featureCounts } = await useFetch<Record<number, number>>(endpoint);

function sheetType(sheet: Sheet) {
	// TODO sheet type should be stored explicitly in sheet table, e.g. T/Q/S/I
	const interactions = deserializeInteractions(sheet.interactions);
	if (sheet.features) {
		return isInteractive(interactions) ? 'interactiveMap' : 'staticMap';
	} else if (sheet.survey) {
		return 'survey';
	} else {
		return 'text';
	}
}

function sheetIcon(sheet: Sheet) {
	const type = sheetType(sheet);
	return SHEET_TYPES.filter((t) => t.name === type)[0].icon;
}

const sheetDependencies = computed(() => {
	const questionsDict: Record<string, number> = {}; // questionId -> sheet ord
	const sheetDeps: Record<number, number[]> = {}; // sheet ord -> [sheet ord]
	(project.value.sheets || []).forEach((s) => {
		if (!s.survey) return;
		const { questions } = JSON.parse(s.survey) as { questions: Question[] };
		questions?.forEach((q) => {
			questionsDict[q.id] = s.ord;
			if (!Array.isArray(q.showIf)) return;
			q.showIf.forEach((c) => {
				const qid = c[0][0];
				const ord = questionsDict[qid];
				sheetDeps[s.ord] = sheetDeps[s.ord] || [];
				if (s.ord !== ord) sheetDeps[s.ord].push(ord);
			});
		});
	});
	return sheetDeps;
});

const isThereReferencedSheet = computed(() => {
	return Object.values(sheetDependencies.value).findIndex((v) => v?.length > 0) > -1;
});

function canMoveUp(sheet: Sheet) {
	if (!sheet.ord) return false; // handling zero (1st sheet) too :)
	const deps = sheetDependencies.value[sheet.ord] || [];
	if (!deps.length) return true;
	const minIndex = Math.max(...deps) + 1;
	return sheet.ord > minIndex;
}

function canMoveDown(sheet: Sheet) {
	const n = project.value?.sheets?.length || 0;
	if (sheet.ord === n - 1) return false;
	const ords = Object.keys(sheetDependencies.value);
	if (!ords.length) return true;
	let firstDependentOrd = Number.MAX_SAFE_INTEGER;
	ords.forEach((ord) => {
		const deps = sheetDependencies.value[Number(ord)];
		if (deps.includes(sheet.ord)) {
			firstDependentOrd = Math.min(firstDependentOrd, Number(ord));
		}
	});
	return sheet.ord < firstDependentOrd - 1;
}

function canDelete(sheet: Sheet) {
	return !Object.keys(sheetDependencies.value).find((ord) => {
		const deps = sheetDependencies.value[Number(ord)];
		return deps.includes(sheet.ord);
	});
}

function openNewSheetModal() {
	// FIXME
	//this.$bvModal.show('create-sheet-modal');
}

const emit = defineEmits<{
	(e: 'sheetsChanged'): void;
}>();

const { t } = useI18n();
const { confirmDeletion } = useConfirmation();
const { errorToast } = useToasts();

async function deleteSheet(sheet: Sheet) {
	const confirmed = await confirmDeletion(sheet.title);
	if (!confirmed) return;
	try {
		await $fetch(`/api/sheet/${sheet.id}`, { method: 'DELETE' });
		emit('sheetsChanged');
	} catch {
		errorToast(t('projectEditor.sheetDeletionFailed'));
	}
}

async function moveSheet(sheet: Sheet, delta: number) {
	try {
		console.log('MOVING SHEET', delta);
		await $fetch(`/api/sheet/${sheet.id}`, {
			method: 'PATCH',
			body: { ord: sheet.ord + delta },
		});
		emit('sheetsChanged');
	} catch {
		errorToast(t('projectEditor.sheetMovingFailed'));
	}
}

async function submittedFeaturesToMap(sheet: Sheet) {
	const data = {
		title: `${project.value.title} / ${sheet.title} ${new Date().toLocaleString()}`,
		importSubmittedFeatures: sheet.id,
	};
	const { id } = await $fetch<{ id: number }>('/api/map', { method: 'PUT', body: data });
	navigateTo(localePath(`/admin/map/${id}`));
}

async function submittedFeaturesToKML(sheet: Sheet) {
	const features = await $fetch<GeoJsonFeature[]>(`/api/sheet/${sheet.id}/submitted-features`);
	const kml = featuresToKML(features);
	const blob = new Blob([kml], {
		type: 'application/vnd.google-earth.kml+xml;charset=utf-8',
	});
	saveAs(blob, (sheet.title || project.value.title || 'partimap') + '.kml');
}
</script>

<template>
	<div class="container mb-5">
		<div class="card shadow-sm">
			<div class="card-header d-flex">
				<button
					class="btn btn-success ms-auto"
					type="button"
					@click="openNewSheetModal"
				>
					{{ $t('ProjectSheetManager.addSheet') }}
				</button>

				<!-- FIXME <NewSheetModal
						:project-id="projectId"
						@added-sheet="emit('sheetsChanged')"
					/> -->
			</div>
			<div class="card-body">
				<div class="list-group">
					<div
						v-for="sheet in project.sheets"
						:key="sheet.id"
						class="d-flex flex-column list-group-item px-2"
						style="gap: 0.5rem"
					>
						<div class="d-flex">
							<div class="d-flex flex-shrink-0">
								<i
									:class="sheetIcon(sheet)"
									class="fas fa-fw me-3 mt-1"
								/>
								<span class="d-none d-lg-block me-3"> {{ sheet.ord + 1 }}. </span>
							</div>
							<NuxtLink
								:to="localePath(`/admin/project/${project.id}/${sheet.ord}`)"
								class="fw-bold me-2"
							>
								{{ sheet.title }}
							</NuxtLink>

							<div class="d-flex ms-auto">
								<span
									v-if="canMoveUp(sheet)"
									class="me-3"
									role="button"
									@click.prevent="moveSheet(sheet, -1)"
								>
									<i class="fas fa-fw fa-arrow-up" />
								</span>
								<span
									v-if="canMoveDown(sheet)"
									class="me-3"
									role="button"
									@click.prevent="moveSheet(sheet, 1)"
								>
									<i class="fas fa-fw fa-arrow-down" />
								</span>
								<span
									v-if="canDelete(sheet)"
									class="text-danger"
									role="button"
									@click.prevent="deleteSheet(sheet)"
								>
									<i class="fas fa-fw fa-trash" />
								</span>
							</div>
						</div>

						<div
							v-if="featureCounts?.[sheet.id]"
							class="d-flex flex-wrap pl-4"
							style="gap: 0.5rem"
						>
							<b-button
								size="sm"
								variant="primary"
								:to="
									localePath(
										`/admin/project/${project.id}/${sheet.ord}/submitted-features`,
									)
								"
							>
								<i class="fas fa-fw fa-eye" />
								<strong>{{ featureCounts[sheet.id] }}</strong>
								{{ $t('ProjectSheetManager.submittedFeatures') }}
							</b-button>

							<b-button
								size="sm"
								variant="outline-primary"
								@click.prevent="submittedFeaturesToMap(sheet)"
							>
								<i class="fas fa-fw fa-plus-circle" />
								{{ $t('ProjectSheetManager.sendToMap') }}
							</b-button>

							<b-button
								size="sm"
								variant="outline-primary"
								@click.prevent="submittedFeaturesToKML(sheet)"
							>
								<i class="fas fa-fw fa-download" />
								KML
							</b-button>
						</div>
					</div>
				</div>
				<div
					v-if="isThereReferencedSheet"
					class="alert alert-warning"
				>
					{{ $t('ProjectSheetManager.warnForReferencedSheets') }}
				</div>
			</div>
		</div>
	</div>
</template>
