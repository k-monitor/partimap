<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';
import type { Map } from '~/server/data/maps';
import type { Project } from '~/server/data/projects';
import type { Sheet } from '~/server/data/sheets';

const { t } = useI18n();

const visible = defineModel<boolean>();

const { data: maps } = await useFetch<Map[]>('/api/map/all?onlyFeatureCounts=1');
const mapOptions = computed(() => [
	{ value: null, text: t('FeatureImportModal.selectMap') },
	...(maps.value || [])
		.filter((m) => m.featureCount)
		.map((m) => ({
			value: m,
			text: `${m.title} (${m.featureCount})`,
		})),
]);

const { data: projects } = await useFetch<Project[]>('/api/project/all?onlyOwn=1');
const projectOptions = computed(() => [
	{
		value: null,
		text: t('FeatureImportModal.selectProject'),
	},
	...(projects.value || []).map((p) => ({
		value: p,
		text: p.title,
	})),
]);

const project = ref<Project | null>(null);
const sheet = ref<Sheet | null>(null);
const sheets = ref<Sheet[]>([]);

watch(project, async (project) => {
	if (!project) {
		sheet.value = null;
		sheets.value = [];
		return;
	}
	const projectData = await $fetch<Project>(`/api/project/${project.id}`);
	const sfcs = await $fetch(`/api/project/${project.id}/feature-counts`);
	sheets.value = (projectData.sheets || [])
		.map((s) => {
			const f = JSON.parse(s.features || '[]');
			s.featureCount = f.length;
			s.submittedFeatureCount = Number(sfcs[s.id] || 0);
			return s;
		})
		.filter((s) => (s.featureCount || 0) + (s.submittedFeatureCount || 0) > 0);
});

const sheetOptions = computed(() => [
	{
		value: null,
		text: t('FeatureImportModal.selectSheet'),
	},
	...sheets.value.map((s) => ({
		value: s,
		text: `${s.title}`,
	})),
]);

const map = ref<Map | null>(null);

const emit = defineEmits<{
	(e: 'import-features', features: GeoJsonFeature[]): void;
}>();

function emitFeatures(features: GeoJsonFeature[]) {
	emit('import-features', features);
	visible.value = false;
}

async function importFromMap() {
	if (!map.value) return;
	const mapData = await $fetch<Map>(`/api/map/${map.value.id}`);
	const features = safeParseJSONArray(mapData.features);
	emitFeatures(features);
}

function importFixed() {
	if (!sheet.value) return;
	const features = safeParseJSONArray(sheet.value.features);
	emitFeatures(features);
}

async function importSubmitted() {
	if (!sheet.value) return;
	const features = await $fetch<GeoJsonFeature[]>(
		`/api/sheet/${sheet.value.id}/submitted-features`,
	);
	emitFeatures(features);
}
</script>

<template>
	<b-modal
		v-model="visible"
		hide-footer
		:teleport-disabled="true"
		teleport-to="body"
		:title="$t('FeatureImportModal.title')"
	>
		<b-form-group :label="$t('FeatureImportModal.importFromMap')">
			<b-form-select
				v-model="map"
				class="mb-3"
				:options="mapOptions"
			/>
			<div class="d-flex justify-content-end">
				<b-button
					:disabled="!map"
					variant="success"
					@click="importFromMap"
				>
					<i class="fas fa-fw fa-file-import" />
					{{
						$t('FeatureImportModal.doImportFromMap', {
							n: map?.featureCount || 0,
						})
					}}
				</b-button>
			</div>
		</b-form-group>

		<hr class="mt-4" />

		<b-form-group :label="$t('FeatureImportModal.importFromSheet')">
			<b-form-select
				v-model="project"
				class="mb-3"
				:options="projectOptions"
			/>
			<b-form-select
				v-model="sheet"
				class="mb-3"
				:disabled="!sheets || !sheets.length"
				:options="sheetOptions"
			/>
			<div class="d-flex">
				<b-button
					:disabled="!sheet || !sheet.submittedFeatureCount"
					variant="success"
					@click="importSubmitted"
				>
					<i class="fas fa-fw fa-file-import" />
					{{
						$t('FeatureImportModal.doImportSubmitted', {
							n: sheet?.submittedFeatureCount || 0,
						})
					}}
				</b-button>
				<b-button
					class="ms-3"
					:disabled="!sheet || !sheet.featureCount"
					variant="success"
					@click="importFixed"
				>
					<i class="fas fa-fw fa-file-import" />
					{{
						$t('FeatureImportModal.doImportFixed', {
							n: sheet?.featureCount || 0,
						})
					}}
				</b-button>
			</div>
		</b-form-group>
	</b-modal>
</template>
