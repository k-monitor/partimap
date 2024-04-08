<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';
import { saveAs } from 'file-saver';

const { t } = useI18n();

const { filteredFeatureIds, loading, selectedFeatureId, sidebarVisible } = useStore();

const sheet = inject<Record<string, any>>('sheet', {}); // FIXME Sheet type
const interactions = inject<Record<string, any>>('interactions', {}); // FIXME Interactions type

const features = defineModel<GeoJsonFeature[]>();

function handleFeatureChange(feature: GeoJsonFeature) {
	const _features = features.value || [];
	const index = _features.findIndex((f) => f.id === feature.id);
	if (index === -1) return;
	_features[index] = feature;
	features.value = _features;
}

function handleFeatureDelete(featureId: number) {
	const _features = features.value || [];
	const index = _features.findIndex((f) => f.id === featureId);
	if (index === -1) return;
	_features.splice(index, 1);
	features.value = _features;
}

const props = defineProps<{
	filename: string;
	isInteractive?: boolean;
	isOnEditorView?: boolean;
	isOnSheetView?: boolean;
	isOnSubmittedView?: boolean;
	showResults?: boolean;
}>();

const hideAdminFeatures = computed(() => props.isOnSheetView && props.isInteractive);

function getAvailableFeatures() {
	console.log('getAvailableFeatures');
	return (features.value || []).filter((f) => {
		if (props.isOnSheetView && !f.properties?.visitorFeature) {
			// case: admin features on public sheet
			// static sheet: hide hidden admin features
			// interactive sheet: hide all admin features
			return !f.properties?.hidden;
		}
		return true;
	});
}
const availableFeatures = ref(getAvailableFeatures());
watch(features, () => (availableFeatures.value = getAvailableFeatures()), { deep: true });

const showSearch = computed(() => !props.isOnSheetView || availableFeatures.value.length > 3);
const search = ref('');
const categoryFilter = ref('');

function toggleCategoryFilter(c: string) {
	categoryFilter.value = categoryFilter.value === c ? '' : c;
	setTimeout(() => {
		if (isMobile()) sidebarVisible.value = false;
	}, 500);
}

const categories = computed<string[]>(() => {
	const cats = new Set(
		availableFeatures.value
			.map((f) => (f.properties?.category || '').trim())
			.filter((f) => f.length),
	);
	return Array.from(cats);
});

const answers = computed(() => {
	const answers: any[] = [];
	(features.value || []).forEach((f) => {
		const json = f.properties?.partimapFeatureQuestion_ans;
		const arr = safeParseJSONArray(json);
		arr.forEach((a) => {
			if (!answers.includes(a)) answers.push(a);
		});
	});
	answers.sort();
	return answers;
});

const filteredFeatures = computed(() => {
	return availableFeatures.value.filter(featureFilter).sort((a, b) => {
		const ac = a.properties?.category || '';
		const bc = b.properties?.category || '';
		if (ac !== bc) return String(ac).localeCompare(String(bc));

		const an = a.properties?.name || a.id;
		const bn = b.properties?.name || b.id;
		return String(an).localeCompare(String(bn));
	});
});

function featureFilter(f: GeoJsonFeature): boolean {
	if (f.id === selectedFeatureId.value) {
		// make sure selected feature won't be filtered out
		// when its name is edited
		return true;
	}

	if (categoryFilter.value && f.properties?.category !== categoryFilter.value) {
		return false;
	}

	const defaultName = t('FeatureListElement.defaultName.' + f.geometry.type);
	const needle = search.value.toLowerCase();
	const haystack = [
		String(f.properties?.id || ''),
		f.properties?.name || defaultName,
		f.properties?.category || '',
		f.properties?.partimapFeatureQuestion_ans || '',
		// TODO add partimapMapLabel too?
	]
		.join('|')
		.toLowerCase();
	return haystack.includes(needle);
}

watch(filteredFeatures, () => {
	// updating map
	filteredFeatureIds.value = filteredFeatures.value.map((f) => Number(f.id)).filter((id) => !!id);
});

watch(selectedFeatureId, (id) => {
	if (!id) return;
	const ids = filteredFeatureIds.value || [];
	if (!ids) return;
	if (!ids.includes(id)) {
		// selected feature doesn't match current search filter
		// it means that click was on the map, we must show the
		// feature to the user -> we should reset search filter
		categoryFilter.value = '';
		search.value = '';
	}
});

const filteredAdminFeatures = computed(() => {
	let arr = filteredFeatures.value.filter((f) => !f.properties?.visitorFeature);
	if (props.showResults) {
		arr = arr.sort((a, b) => {
			const ra = getAggregatedRatingValue(Number(a.id));
			const rb = getAggregatedRatingValue(Number(b.id));
			return rb - ra;
		});
	}
	return arr;
});

const filteredVisitorFeatures = computed(() => {
	return filteredFeatures.value.filter((f) => f.properties?.visitorFeature);
});

function getAggregatedRating(featureId: number) {
	const dict = sheet.ratings || {};
	return dict[String(featureId)] || {};
}

function getAggregatedRatingValue(featureId: number) {
	const r = getAggregatedRating(featureId);
	switch (interactions.stars) {
		case -2:
			return r.sum;
		case 1:
			return r.count;
		default:
			return r.average;
	}
}

async function exportKML() {
	loading.value = true;
	await nextTick();
	const kml = featuresToKML(filteredFeatures.value);
	const blob = new Blob([kml], {
		type: 'application/vnd.google-earth.kml+xml;charset=utf-8',
	});
	saveAs(blob, (props.filename || 'partimap') + '.kml');
	loading.value = false;
}

async function importKML() {
	const input = document.createElement('input');
	input.setAttribute('type', 'file');
	input.addEventListener('change', async (e: Event) => {
		const fileInputEl = e.target as HTMLInputElement;
		const file = fileInputEl.files?.[0];
		if (!file) return;

		const fileReader = new FileReader();
		fileReader.onload = async (e: Event) => {
			const kmlString = (e.target as FileReader).result?.toString() || '';
			const importedFeatures = KMLToFeatures(kmlString);
			features.value?.push(...importedFeatures);
			await nextTick();
			selectedFeatureId.value = -1; // triggering fitToView pt.1
			loading.value = false;
			await nextTick();
			selectedFeatureId.value = null; // triggering fitToView pt.2
		};
		fileReader.readAsText(file);
	});

	selectedFeatureId.value = null;
	loading.value = true;
	await nextTick();
	input.click();
}

const { confirmDeleteFeatures } = useConfirmation();

async function deleteAll() {
	const ids = filteredFeatures.value.map((f) => f.id);
	const confirmed = await confirmDeleteFeatures(ids.length);
	if (!confirmed) return;
	features.value = (features.value || []).filter((f) => !ids.includes(f.id));
	categoryFilter.value = '';
	search.value = '';
}
</script>

<template>
	<div class="mb-4">
		<h6
			v-if="!hideAdminFeatures"
			class="mb-0"
		>
			{{ $t('FeatureList.features') }}
		</h6>

		<div
			v-if="!isOnSheetView"
			class="d-flex justify-content-center mb-3"
		>
			<button
				class="btn btn-sm btn-primary m-2"
				@click="exportKML"
			>
				<i class="fas fa-fw fa-download" />
				<br />
				KML
			</button>
			<template v-if="!isOnSubmittedView">
				<button
					class="btn btn-sm btn-success m-2"
					@click="importKML"
				>
					<i class="fas fa-fw fa-upload" />
					<br />
					KML
				</button>
				<!-- FIXME -->
				<!-- <button
					class="btn btn-sm btn-success m-2"
					@click="$bvModal.show('featureImportModal')"
				>
					<i class="fas fa-fw fa-file-import" />
					<br />
					{{ $t('FeatureList.importFromSheet') }}
				</button> -->
				<button
					class="btn btn-sm btn-danger m-2"
					@click="deleteAll"
				>
					<i class="fas fa-fw fa-trash" />
					<br />
					{{ $t('FeatureList.deleteAll') }}
				</button>
			</template>
		</div>
		<div>
			<div
				v-if="showSearch"
				class="input-group mb-3 mt-3"
			>
				<input
					v-model="search"
					class="form-control"
					:placeholder="$t('FeatureList.search')"
					type="search"
				/>
				<button
					class="btn btn-outline-secondary"
					:disabled="!search"
					@click="search = ''"
				>
					<i class="fas fa-backspace" />
				</button>
			</div>
			<div
				v-for="c in categories"
				:key="c"
				class="badge border border-secondary m-2"
				:class="categoryFilter === c ? 'text-bg-dark' : 'text-bg-light'"
				role="button"
				@click="toggleCategoryFilter(c)"
			>
				{{ c }}
			</div>
			<div
				v-for="a in answers"
				:key="a"
				class="badge border border-secondary m-2"
				role="button"
				:class="search === a ? 'text-bg-dark' : 'text-bg-light'"
				@click="search === a ? (search = '') : (search = a)"
			>
				{{ a }}
			</div>
		</div>
	</div>

	<form-group
		v-if="filteredVisitorFeatures.length"
		:label="$t('FeatureList.ownFeatures')"
	>
		<div class="list-group">
			<!-- only on public interactive sheets -->
			<FeatureListElement
				v-for="feature in filteredVisitorFeatures"
				:key="feature.id"
				:categories="categories"
				:feature="feature"
				is-interactive
				:is-on-sheet-view="isOnSheetView"
				@change="handleFeatureChange"
				@delete="handleFeatureDelete"
			/>
		</div>
	</form-group>

	<form-group
		v-if="!hideAdminFeatures"
		:label="filteredVisitorFeatures.length ? $t('FeatureList.fixedFeatures') : null"
	>
		<div class="list-group">
			<FeatureListElement
				v-for="feature in filteredAdminFeatures"
				:key="feature.id"
				:aggregated-rating="getAggregatedRating(Number(feature.id))"
				:categories="categories"
				:feature="feature"
				:is-interactive="isInteractive"
				:is-on-editor-view="isOnEditorView"
				:is-on-sheet-view="isOnSheetView"
				:is-on-submitted-view="isOnSubmittedView"
				:show-results="showResults"
				@change="handleFeatureChange"
				@delete="handleFeatureDelete(Number(feature.id))"
			/>
		</div>
	</form-group>

	<p
		v-if="search && !filteredFeatures.length"
		class="font-italic text-muted"
	>
		{{ $t('FeatureList.notFound') }}
	</p>

	<!-- FIXME -->
	<!-- <FeatureImportModal @import-features="handleImportFeatures" /> -->
</template>
