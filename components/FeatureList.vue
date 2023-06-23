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
				v-if="!visitor"
				class="d-flex justify-content-center mb-3"
			>
				<b-button
					class="m-2"
					size="sm"
					variant="primary"
					@click="exportKML"
				>
					<i class="fas fa-fw mr-2 fa-download" />
					KML
				</b-button>
				<b-button
					class="m-2"
					size="sm"
					variant="success"
					@click="importKML"
				>
					<i class="fas fa-fw mr-2 fa-upload" />
					KML
				</b-button>
			</div>
			<div v-if="!hideAdminFeatures">
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
			</div>
		</b-form-group>
		<b-form-group
			v-if="filteredVisitorFeatures.length"
			:label="$t('FeatureList.ownFeatures')"
		>
			<b-list-group>
				<FeatureListElement
					v-for="feature in filteredVisitorFeatures"
					:key="feature.getId()"
					:categories="categories"
					:description-label="descriptionLabelFor(feature)"
					:feature="feature"
					:init-feature-rating="getFeatureRating(feature.getId())"
					:stars="interactions?.stars"
					:visitor="visitor"
					:visitor-can-name="interactions?.enabled.includes('naming')"
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
					:categories="categories"
					:feature="feature"
					:init-feature-rating="getFeatureRating(feature.getId())"
					:show-results="showResults"
					:stars="interactions?.stars"
					:visitor="visitor"
					:visitor-can-rate="interactions?.enabled.includes('Rating')"
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
	</div>
</template>

<script>
import { saveAs } from 'file-saver';
import { mapGetters, mapMutations } from 'vuex';
import { featuresToKML, KMLToFeatures } from '@/assets/kml';
import { isMobile } from '~/assets/constants';

export default {
	props: {
		initFeatureRatings: {
			type: Object,
			default: () => {},
		},
		interactions: {
			type: Object, // TODO Interactions actually, but throws warnings on console
			default: null,
		},
		showResults: {
			type: Boolean,
			default: false,
		},
		visitor: {
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
		filteredAdminFeatures() {
			return this.filteredFeatures.filter(
				f =>
					!f.get('visitorFeature') &&
					(!this.visitor || !f.get('hidden')) // hiding hidden features in visitor mode
			);
		},
		filteredVisitorFeatures() {
			return this.filteredFeatures.filter(f => f.get('visitorFeature'));
		},
		hideAdminFeatures() {
			return this.visitor && this.isInteractive;
		},
		isInteractive() {
			return (
				this.interactions &&
				(this.interactions.enabled.includes('Point') ||
					this.interactions.enabled.includes('LineString') ||
					this.interactions.enabled.includes('Polygon'))
			);
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
		descriptionLabelFor(feature) {
			const dt = feature.getGeometry().getType();
			const lab = this.interactions?.descriptionLabels[dt];
			return lab || this.sheet?.descriptionLabel || '';
		},
		getFeatureRating(featureId) {
			const dict = this.initFeatureRatings || {};
			const rating = dict[featureId.toString()];
			if (Number.isInteger(rating)) {
				// public sheet gets rating from store
				// which is a pure integer value
				return { average: rating, count: 1, sum: rating };
			} else {
				// admin sheet gets AggregatedRating object
				return rating || {};
			}
		},
		updateCategories() {
			const cats = new Set(
				this.getAllFeatures
					.map(f => (f.get('category') || '').trim())
					.filter(f => f.length)
			);
			this.categories = Array.from(cats);
		},
		updateFilteredFeatures() {
			this.filteredFeatures = this.getAllFeatures
				.filter(
					f =>
						!this.categoryFilter ||
						f.get('category') === this.categoryFilter
				)
				.filter(
					f =>
						String(f.getId() || '')
							.toLowerCase()
							.includes(this.search.toLowerCase()) ||
						(f.get('name') || '')
							.toLowerCase()
							.includes(this.search.toLowerCase()) ||
						(f.get('category') || '')
							.toLowerCase()
							.includes(this.search.toLowerCase())
				)
				.sort((a, b) => {
					const ac = a.get('category') || '';
					const bc = b.get('category') || '';
					if (ac === bc) {
						const an = a.get('name') || a.getId();
						const bn = b.get('name') || b.getId();
						return String(an).localeCompare(String(bn));
					}
					return String(ac).localeCompare(String(bc));
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
			saveAs(blob, 'partimap.kml');
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
	},
};
</script>
