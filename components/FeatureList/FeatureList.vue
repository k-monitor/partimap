<template>
	<div>
		<b-form-group class="mb-4">
			<template #label>
				<h6
					v-if="!hideAdminFeatures"
					class="mb-0"
				>
					{{ $t('FeatureList.features') }}
				</h6>
			</template>
			<div
				v-if="!isOnSheetView"
				class="d-flex justify-content-center mb-3"
			>
				<b-button
					class="m-2"
					size="sm"
					variant="primary"
					@click="exportKML"
				>
					<i class="fas fa-fw fa-download" />
					<br />
					KML
				</b-button>
				<template v-if="!isOnSubmittedView">
					<b-button
						class="m-2"
						size="sm"
						variant="success"
						@click="importKML"
					>
						<i class="fas fa-fw fa-upload" />
						<br />
						KML
					</b-button>
					<b-button
						class="m-2"
						size="sm"
						variant="success"
						@click="$bvModal.show('featureImportModal')"
					>
						<i class="fas fa-fw fa-file-import" />
						<br />
						{{ $t('FeatureList.importFromSheet') }}
					</b-button>
					<b-button
						class="m-2"
						size="sm"
						variant="danger"
						@click="deleteAll"
					>
						<i class="fas fa-fw fa-trash" />
						<br />
						{{ $t('FeatureList.deleteAll') }}
					</b-button>
				</template>
			</div>
			<div v-if="showSearch">
				<b-input-group class="mt-3">
					<b-form-input
						v-model="search"
						:placeholder="$t('FeatureList.search')"
					/>
					<template #append>
						<b-button
							:disabled="!search"
							variant="outline-secondary"
							@click="search = ''"
						>
							<i class="fas fa-backspace" />
						</b-button>
					</template>
				</b-input-group>
				<b-badge
					v-for="c in categories"
					:key="c"
					class="border border-secondary m-2"
					role="button"
					:variant="categoryFilter === c ? 'dark' : 'light'"
					@click="toggleCategoryFilter(c)"
					v-text="c"
				/>
				<b-badge
					v-for="a in answers"
					:key="a"
					class="border border-secondary m-2"
					role="button"
					:variant="search === a ? 'dark' : 'light'"
					@click="search === a ? (search = '') : (search = a)"
					v-text="a"
				/>
			</div>
		</b-form-group>
		<b-form-group
			v-if="filteredVisitorFeatures.length"
			:label="$t('FeatureList.ownFeatures')"
		>
			<b-list-group>
				<!-- only on public interactive sheets -->
				<FeatureListElement
					v-for="feature in filteredVisitorFeatures"
					:key="feature.getId()"
					:categories="categories"
					:feature="feature"
					is-interactive
					:is-on-sheet-view="isOnSheetView"
					@categoryEdited="updateCategories"
				/>
			</b-list-group>
		</b-form-group>
		<b-form-group
			v-if="!hideAdminFeatures"
			:label="
				filteredVisitorFeatures.length
					? $t('FeatureList.fixedFeatures')
					: null
			"
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
					@categoryEdited="updateCategories"
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
	</div>
</template>

<script>
import { saveAs } from 'file-saver';
import { mapGetters, mapMutations } from 'vuex';
import { featuresToKML, KMLToFeatures } from '@/assets/kml';
import { isMobile } from '~/assets/constants';

export default {
	inject: ['sheet'],
	props: {
		filename: {
			type: String,
			default: '',
		},
		isInteractive: {
			type: Boolean,
			default: false,
		},
		isOnEditorView: {
			type: Boolean,
			default: false,
		},
		isOnSheetView: {
			type: Boolean,
			default: false,
		},
		isOnSubmittedView: {
			type: Boolean,
			default: false,
		},
		showResults: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			categories: [],
			categoryFilter: '',
			filteredFeatures: [],
			search: '',
		};
	},
	computed: {
		...mapGetters({
			getAllFeatures: 'features/getAllFeature',
			getSelectedFeature: 'selected/getSelectedFeature',
		}),
		availableFeatures() {
			return this.getAllFeatures.filter(f => {
				if (this.isOnSheetView && !f.get('visitorFeature')) {
					// case: admin features on public sheet
					// static sheet: hide hidden admin features
					// interactive sheet: hide all admin features
					return !f.get('hidden') && !this.isInteractive;
				}
				return true;
			});
		},
		showSearch() {
			return !this.isOnSheetView || this.availableFeatures.length > 3;
		},
		filteredAdminFeatures() {
			let arr = this.filteredFeatures.filter(
				f => !f.get('visitorFeature')
			);
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
			return this.filteredFeatures.filter(f => f.get('visitorFeature'));
		},
		hideAdminFeatures() {
			return this.isOnSheetView && this.isInteractive;
		},
		answers() {
			const answers = [];
			this.getAllFeatures.forEach(f => {
				const json = f.get('partimapFeatureQuestion_ans');
				try {
					const arr = JSON.parse(json);
					arr.forEach(a => {
						if (!answers.includes(a)) answers.push(a);
					});
				} catch {}
			});
			return answers.sort();
		},
	},
	watch: {
		getSelectedFeature(f) {
			if (f) {
				const id = f.getId();
				const ids = this.filteredFeatures.map(f => f.getId());
				if (!ids.includes(id)) {
					// selected feature doesn't match current search filter
					// it means that click was on the map, we must show the
					// feature to the user -> we should reset search filter
					this.categoryFilter = '';
					this.search = '';
				}
			}
			this.updateFilteredFeatures();
		},
		getAllFeatures() {
			this.updateFilteredFeatures();
		},
		search() {
			this.updateFilteredFeatures();
		},
		categoryFilter() {
			this.updateFilteredFeatures();
		},
	},
	methods: {
		...mapMutations(['setSidebarVisible']),
		getAggregatedRating(featureId) {
			const dict = this.sheet?.ratings || {};
			return dict[featureId.toString()] || {};
		},
		getAggregatedRatingValue(feature) {
			const r = this.getAggregatedRating(feature.getId());
			return this.interactions?.stars === -2 ? r.sum : r.average;
		},
		updateCategories() {
			const cats = new Set(
				this.availableFeatures
					.map(f => (f.get('category') || '').trim())
					.filter(f => f.length)
			);
			this.categories = Array.from(cats);
		},
		featureFilter(f) {
			if (
				this.categoryFilter &&
				f.get('category') !== this.categoryFilter
			) {
				return false;
			}

			const needle = this.search.toLowerCase();
			const haystack = [
				String(f.getId() || ''),
				f.get('name') || '',
				f.get('category') || '',
				f.get('partimapFeatureQuestion_ans') || '',
			]
				.join('\n')
				.toLowerCase();
			return haystack.includes(needle);
		},
		updateFilteredFeatures() {
			this.filteredFeatures = this.availableFeatures
				.filter(this.featureFilter)
				.sort((a, b) => {
					const ac = a.get('category') || '';
					const bc = b.get('category') || '';
					if (ac !== bc) return String(ac).localeCompare(String(bc));

					const an = a.get('name') || a.getId();
					const bn = b.get('name') || b.getId();
					return String(an).localeCompare(String(bn));
				});

			const ids = this.filteredFeatures.map(f => f.getId());
			this.$nuxt.$emit('filterFeatures', ids);
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
			input.addEventListener('change', e => {
				const f = e.target.files[0];
				if (!f) return;
				this.$nuxt.$emit('toggleLoading', true);
				const reader = new FileReader();
				reader.onload = (e => {
					return e => {
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
			const ids = this.filteredFeatures.map(f => f.getId());
			const confirmed = await this.confirmDeleteFeatures(ids.length);
			if (confirmed) {
				this.$nuxt.$emit('clearFeatures', ids);
				this.categoryFilter = '';
				this.search = '';
			}
		},
	},
};
</script>
