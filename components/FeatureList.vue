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
			<div v-if="!hideAdminFeatures">
				<vue-typeahead-bootstrap
					v-model="search"
					:placeholder="$t('FeatureList.search')"
					:data="categories"
					:min-matching-chars="0"
					show-all-results
					show-on-focus
				>
					<template #append>
						<b-button
							:disabled="!search"
							variant="outline-secondary"
							@click="search=''"
						>
							<i class="fas fa-backspace" />
						</b-button>
					</template>
				</vue-typeahead-bootstrap>
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
					:description-label="descriptionLabel"
					:feature="feature"
					:init-feature-rating="getFeatureRating(feature.getId())"
					:stars="stars"
					:visitor="visitor"
					@categoryEdited="updateCategories"
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
					:categories="categories"
					:feature="feature"
					:init-feature-rating="getFeatureRating(feature.getId())"
					:stars="stars"
					:visitor="visitor"
					:visitor-can-rate="visitorCanRate"
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
		<div
			v-if="!visitor"
			class="d-flex justify-content-center"
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
	</div>
</template>

<script>
import { saveAs } from 'file-saver';
import KML from 'ol/format/KML';
import { mapGetters } from 'vuex';
import VueTypeaheadBootstrap from 'vue-typeahead-bootstrap';

export default {
	components: {
		VueTypeaheadBootstrap,
	},
	props: {
		descriptionLabel: {
			type: String,
			default: null,
		},
		hideAdminFeatures: {
			type: Boolean,
			default: false,
		},
		initFeatureRatings: {
			type: Object,
			default: () => {},
		},
		stars: {
			type: Number,
			default: 5,
		},
		visitor: {
			type: Boolean,
			default: false,
		},
		visitorCanRate: {
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
			return this.filteredFeatures.filter(f => !f.get('visitorFeature'));
		},
		filteredVisitorFeatures() {
			return this.filteredFeatures.filter(f => f.get('visitorFeature'));
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
		getFeatureRating(featureId) {
			const dict = this.initFeatureRatings || {};
			return Number(dict[featureId.toString()] || 0);
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
					f => !this.categoryFilter || f.get('category') === this.categoryFilter
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
		},
		toggleCategoryFilter(c) {
			this.categoryFilter = this.categoryFilter === c ? '' : c;
		},
		exportKML() {
			let kml = new KML().writeFeatures(this.getAllFeatures, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:3857',
			});

			// fixing missing IconStyle
			const search =
				/<Style\/>(<ExtendedData>.*?>#(\w\w)(\w\w)(\w\w)<.*?<\/ExtendedData>)/g;
			const replace =
				'<Style><IconStyle><color>ff$4$3$2</color><scale>1</scale><Icon><href>https://www.gstatic.com/mapspro/images/stock/503-wht-blank_maps.png</href></Icon><hotSpot x="32" xunits="pixels" y="64" yunits="insetPixels"/></IconStyle></Style>$1';
			kml = kml.replace(search, replace);

			const blob = new Blob(['<?xml version="1.0" encoding="UTF-8"?>' + kml], {
				type: 'application/vnd.google-earth.kml+xml;charset=utf-8',
			});
			saveAs(blob, 'partimap.kml');
		},
		importKML() {
			const input = document.createElement('input');
			input.setAttribute('type', 'file');
			input.addEventListener('change', e => {
				const f = e.target.files[0];
				const reader = new FileReader();
				reader.onload = (e => {
					return e => {
						const kmlString = e.target.result;
						const kmlParser = new DOMParser().parseFromString(
							kmlString,
							'text/xml'
						);

						const features = new KML().readFeatures(kmlString, {
							dataProjection: 'EPSG:4326',
							featureProjection: 'EPSG:3857',
						});
						features.forEach((f, i) => {
							const fid = f.getId() || ((new Date().getTime() % 10000000) * 1000 + i);
							f.setId(fid);

							const styleId = f.get('styleUrl')?.split('#')[1];
							const colorEl =
								kmlParser.querySelector(`#${styleId}-normal LineStyle color`) ||
								kmlParser.querySelector(`#${styleId} LineStyle color`) ||
								kmlParser.querySelector(`#${styleId}-normal IconStyle color`) ||
								kmlParser.querySelector(`#${styleId} IconStyle color`) ||
								kmlParser.querySelector(`Placemark[id="${fid}"] color`) ||
								{};
							const abgr = colorEl.innerHTML;
							if (abgr) {
								const color =
									'#' +
									abgr[6] +
									abgr[7] +
									abgr[4] +
									abgr[5] +
									abgr[2] +
									abgr[3];
								f.set('color', color);
							}

							const widthEl =
								kmlParser.querySelector(`#${styleId}-normal LineStyle width`) ||
								kmlParser.querySelector(`#${styleId} LineStyle width`) ||
								kmlParser.querySelector(`Placemark[id="${fid}"] width`) ||
								{};
							if (widthEl.innerHTML) {
								const w = Math.round(Number(widthEl.innerHTML));
								f.set('width', w);
							}

							const dashEl =
								// TODO read value from Google MyMaps KMLs too
								kmlParser.querySelector(`Placemark[id="${fid}"] [name="dash"] value`) ||
								{};
							if (dashEl.innerHTML) {
								// TODO reads correct value for Partimap KMLs, but not sets it (WHY?)
								f.set('dash', dashEl.innerHTML);
							}
						});
						this.$nuxt.$emit('importedFeatures', features);
					};
				})(f);
				reader.readAsText(f);
			});
			input.click();
		},
	},
};
</script>
