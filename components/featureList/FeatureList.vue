<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';
import { safeParseJSONArray } from '~/server/utils/json';

const { t } = useI18n();

const { filteredFeatureIds, selectedFeatureId, sidebarVisible } = useStore();

// FIXME
//const sheet: Record<string, any> | undefined = inject('sheet'); // FIXME Sheet type
//const interactions: Record<string, any> | undefined = inject('interactions'); // FIXME Interactions type

const features = defineModel<GeoJsonFeature[]>();

function handleFeatureChange(feature: GeoJsonFeature) {
	const _features = features.value || [];
	const index = _features.findIndex((f) => f.id === feature.id);
	if (index === -1) return;
	_features[index] = feature;
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

const availableFeatures = computed(() => {
	return (features.value || []).filter((f) => {
		if (props.isOnSheetView && !f.properties?.visitorFeature) {
			// case: admin features on public sheet
			// static sheet: hide hidden admin features
			// interactive sheet: hide all admin features
			return !f.properties?.hidden && !props.isInteractive;
		}
		return true;
	});
});

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
	// FIXME
	return {};
	//const dict = sheet?.ratings || {};
	//return dict[String(featureId)] || {};
}

function getAggregatedRatingValue(featureId: number) {
	// FIXME
	return 0;
	/*const r = getAggregatedRating(featureId);
	switch (interactions?.stars) {
		case -2:
			return r.sum;
		case 1:
			return r.count;
		default:
			return r.average;
	}*/
}

// FIXME
/*import { saveAs } from 'file-saver';
import { featuresToKML, KMLToFeatures } from '@/assets/kml';

export default {
	methods: {
		exportKML() {
			this.$nuxt.$emit('toggleLoading', true);
			const kml = featuresToKML(this.filteredFeatures);
			const blob = new Blob([kml], {
				type: 'application/vnd.google-earth.kml+xml;charset=utf-8',
			});
			this.$nuxt.$emit('toggleLoading', false);
			saveAs(blob, (this.filename || 'partimap') + '.kml');
		},
		importKML() {
			const input = document.createElement('input');
			input.setAttribute('type', 'file');
			input.addEventListener('change', (e) => {
				const f = e.target.files[0];
				if (!f) return;
				this.$nuxt.$emit('toggleLoading', true);
				const reader = new FileReader();
				reader.onload = ((e) => {
					return (e) => {
						const kmlString = e.target.result;
						const features = KMLToFeatures(kmlString);
						this.$nuxt.$emit('importedFeatures', features);
						this.$nuxt.$emit('toggleLoading', false);
					};
				})(f);
				reader.readAsText(f);
			});
			input.click();
		},
		handleImportFeatures(features) {
			this.$nuxt.$emit('importedFeatures', features);
		},
	},
};*/

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
			<!-- FIXME -->
			<!-- <button
				class="btn btn-sm btn-primary m-2"
				@click="exportKML"
			>
				<i class="fas fa-fw fa-download" />
				<br />
				KML
			</button> -->
			<template v-if="!isOnSubmittedView">
				<!-- FIXME -->
				<!-- <button
					class="btn btn-sm btn-success m-2"
					@click="importKML"
				>
					<i class="fas fa-fw fa-upload" />
					<br />
					KML
				</button>
				<button
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
			<!-- <FeatureListElement
				v-for="feature in filteredVisitorFeatures"
				:key="feature.id"
				:categories="categories"
				:feature="feature"
				is-interactive
				:is-on-sheet-view="isOnSheetView"
			/> -->
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
				:feature="feature"
				@change="handleFeatureChange"
			/>
			<!--
				:aggregated-rating="getAggregatedRating(Number(feature.id))"
				:categories="categories"
				:is-interactive="isInteractive"
				:is-on-editor-view="isOnEditorView"
				:is-on-sheet-view="isOnSheetView"
				:is-on-submitted-view="isOnSubmittedView"
				:show-results="showResults"
			-->
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
