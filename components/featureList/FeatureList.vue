<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';

const { t } = useI18n();

const props = defineProps<{
	features: GeoJsonFeature[];
	filename: string;
	isInteractive?: boolean;
	isOnEditorView?: boolean;
	isOnSheetView?: boolean;
	isOnSubmittedView?: boolean;
	showResults?: boolean;
}>();

const hideAdminFeatures = computed(() => props.isOnSheetView && props.isInteractive);

const availableFeatures = computed(() => {
	return props.features.filter((f) => {
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

const { filteredFeatureIds, selectedFeatureId, sidebarVisible } = useStore();
const categories = ref<string[]>([]);
const categoryFilter = ref('');
const search = ref('');

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
	const ids = filteredFeatures.value.map((f) => f.id);
	if (!ids.includes(id)) {
		// selected feature doesn't match current search filter
		// it means that click was on the map, we must show the
		// feature to the user -> we should reset search filter
		categoryFilter.value = '';
		search.value = '';
	}
});

// FIXME
/*import { saveAs } from 'file-saver';
import { featuresToKML, KMLToFeatures } from '@/assets/kml';

export default {
	inject: {
		interactions: {
			default: null,
		},
		sheet: {
			default: null,
		},
	},
	computed: {
		filteredAdminFeatures() {
			let arr = this.filteredFeatures.filter((f) => !f.get('visitorFeature'));
			if (this.showResults) {
				arr = arr.sort((a, b) => {
					const ra = this.getAggregatedRatingValue(a);
					const rb = this.getAggregatedRatingValue(b);
					return rb - ra;
				});
			}

			return arr;
		},
		filteredVisitorFeatures() {
			return this.filteredFeatures.filter((f) => f.get('visitorFeature'));
		},
		answers() {
			const answers = [];
			this.getAllFeatures.forEach((f) => {
				const json = f.get('partimapFeatureQuestion_ans');
				try {
					const arr = JSON.parse(json);
					arr.forEach((a) => {
						if (!answers.includes(a)) answers.push(a);
					});
				} catch {}
			});
			return answers.sort();
		},
	},
	methods: {
		getAggregatedRating(featureId) {
			const dict = this.sheet?.ratings || {};
			return dict[featureId.toString()] || {};
		,
		getAggregatedRatingValue(feature) {
			const r = this.getAggregatedRating(feature.getId());
			switch (this.interactions?.stars) {
				case -2:
					return r.sum;
				case 1:
					return r.count;
				default:
					return r.average;
			}
		},
		updateCategories() {
			const cats = new Set(
				this.availableFeatures
					.map((f) => (f.get('category') || '').trim())
					.filter((f) => f.length),
			);
			this.categories = Array.from(cats);
		},
		toggleCategoryFilter(c) {
			this.categoryFilter = this.categoryFilter === c ? '' : c;
			setTimeout(() => {
				if (isMobile()) this.setSidebarVisible(false);
			}, 500);
		},
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
		async deleteAll() {
			const ids = this.filteredFeatures.map((f) => f.getId());
			const confirmed = await this.confirmDeleteFeatures(ids.length);
			if (confirmed) {
				this.$nuxt.$emit('clearFeatures', ids);
				this.categoryFilter = '';
				this.search = '';
			}
		},
	},
};*/
</script>

<template>
	<div class="mb-4">
		<h6
			v-if="!hideAdminFeatures"
			class="mb-0"
		>
			{{ $t('FeatureList.features') }}
		</h6>
		<!-- FIXME -->
		<!-- <div
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
				<button
					class="btn btn-sm btn-success m-2"
					@click="$bvModal.show('featureImportModal')"
				>
					<i class="fas fa-fw fa-file-import" />
					<br />
					{{ $t('FeatureList.importFromSheet') }}
				</button>
				<button
					class="btn btn-sm btn-danger m-2"
					@click="deleteAll"
				>
					<i class="fas fa-fw fa-trash" />
					<br />
					{{ $t('FeatureList.deleteAll') }}
				</button>
			</template>
		</div> -->
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
			<!-- FIXME -->
			<!-- <div
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
			</div> -->
		</div>
	</div>
	<!-- FIXME -->
	<!--
		<b-form-group
			v-if="filteredVisitorFeatures.length"
			:label="$t('FeatureList.ownFeatures')"
		>
			<b-list-group>
				only on public interactive sheets
				<FeatureListElement
					v-for="feature in filteredVisitorFeatures"
					:key="feature.getId()"
					:categories="categories"
					:feature="feature"
					is-interactive
					:is-on-sheet-view="isOnSheetView"
					@category-edited="updateCategories"
				/>
			</b-list-group>
		</b-form-group>
		<b-form-group
			v-if="!hideAdminFeatures"
			:label="filteredVisitorFeatures.length ? $t('FeatureList.fixedFeatures') : null"
		>
			<b-list-group>
				<FeatureListElement
					v-for="feature in filteredAdminFeatures"
					:key="feature.getId()"
					:aggregated-rating="getAggregatedRating(feature.getId())"
					:categories="categories"
					:feature="feature"
					:is-interactive="isInteractive"
					:is-on-editor-view="isOnEditorView"
					:is-on-sheet-view="isOnSheetView"
					:is-on-submitted-view="isOnSubmittedView"
					:show-results="showResults"
					@category-edited="updateCategories"
				/>
			</b-list-group>
		</b-form-group>
		<p
			v-if="search && !filteredFeatures.length"
			class="font-italic text-muted"
		>
			{{ $t('FeatureList.notFound') }}
		</p>
		<FeatureImportModal @import-features="handleImportFeatures" />
	-->
</template>
