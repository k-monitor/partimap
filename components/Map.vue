/*
	Use only inside <client-only> </client-only> tags!
*/

<template>
	<div>
		<div
			ref="map-root"
			class="h-100 position-absolute w-100 map"
		/>
		<div class="map-zoom-toolbar">
			<b-button-group
				class="shadow-sm"
				vertical
			>
				<b-button
					v-b-tooltip.hover.left
					class="border border-secondary py-2"
					variant="dark"
					title="Alaptérkép váltás"
					@click="changeBaseMap()"
				>
					<i class="fas fa-map" />
					<!-- TODO i18n -->
				</b-button>
				<b-button
					class="border border-secondary py-2"
					variant="dark"
					@click="changeZoom(1)"
				>
					<i class="fas fa-fw fa-plus" />
				</b-button>
				<b-button
					class="border border-secondary py-2"
					variant="dark"
					@click="changeZoom(-1)"
				>
					<i class="fas fa-fw fa-minus" />
				</b-button>
			</b-button-group>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

import 'ol/ol.css';

import Map from 'ol/Map';
import View from 'ol/View';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Draw, Select, Snap } from 'ol/interaction';
import { OSM, Stamen, Vector as VectorSource, XYZ } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Collection from 'ol/Collection';
import Feature from 'ol/Feature';
import { click } from 'ol/events/condition';

export default {
	props: {
		initialBaseMapIndex: {
			type: Number,
			default: 0,
		},
		initialCenter: {
			type: Array,
			default: () => [2129152.791287463, 6017729.508627875],
		},
		initialZoom: {
			type: Number,
			default: 10,
		},
		features: {
			type: Array,
			default: null,
			validator: container => container.every(f => f instanceof Feature),
		},
		visitor: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			// ol/Map object
			map: null,
			center: this.initialCenter,
			zoom: this.initialZoom,
			baseMapIndex: this.initialBaseMapIndex,
			baseMaps: [],
			// default color for drawn features
			defaultColor: {
				drawing: '#607D8B',
				Point: '#F44336',
				LineString: '#3F51B5',
				Polygon: '#4CAF50',
			},
			defaultStroke: {
				lineDash: '0',
				width: 4,
			},

		};
	},
	computed: {
		...mapGetters({ drawType: 'getDrawType' }), // if truthy, a feature is currently drawn
		...mapGetters({ getSelectedFeature: 'selected/getSelectedFeature' }),
	},
	watch: {
		drawType(type) {
			// when drawing, feature selection is disabled
			type
				? this.map.removeInteraction(this.select)
				: this.map.addInteraction(this.select);

			// set draw type on OL map
			this.map.removeInteraction(this.draw);
			this.map.removeInteraction(this.snap);
			if (type) {
				this.draw = new Draw({
					source: this.source,
					type,
				});
				this.map.addInteraction(this.draw);
				this.snap = new Snap({
					source: this.source,
				});
				this.map.addInteraction(this.snap);
			}
		},
		/**
		 * @param selFeature Is null if the map is clicked
		 * without clicking on a feature.
		 */
		getSelectedFeature(selFeature, prevFeature) {
			// sync the local selectedFeatures collection with the store
			const selectedFeatures = this.select.getFeatures();
			if (selFeature && !selectedFeatures.array_.includes(selFeature)) {
				selectedFeatures.push(selFeature);
			}
			// clear the selection of the previously selected feature
			if (selectedFeatures.array_.includes(prevFeature)) {
				selectedFeatures.remove(prevFeature);
			}
			// deselect the feature if the plain map is clicked
			if (!selFeature) {
				// removes the blur which indicates selection
				this.removeBlur();
				this.select.getFeatures().pop();
			} else {
				this.source.getFeatures().forEach(feature => {
					this.updateFeatureStyle(feature, selFeature);
				});
			}

			this.fitViewToFeatures();
		},
	},
	mounted() {
		this.$store.commit('selected/clear');
		this.initMapComponents();
		this.fitViewToFeatures();
		this.addEventListeners();
	},
	created() {
		// handles feature deletion, performed in the feature-sidebar
		this.$nuxt.$on('clearFeature', feature => {
			this.vector.getSource().removeFeature(feature);
		});
		// handles feature style change, performed in the feature-sidebar
		this.$nuxt.$on('changeStyle', (feature, color, dash, width) => {
			this.changeFeatureStyle(feature, color, dash, width, true);
		});

		this.$nuxt.$on('importedFeatures', features => {
			features.forEach(f => this.vector.getSource().addFeature(f));
		});
	},
	beforeDestroy() {
		this.$nuxt.$off('clearFeature');
		this.$nuxt.$off('changeStyle');
	},
	methods: {
		changeBaseMap() {
			this.baseMapIndex = (this.baseMapIndex + 1) % this.baseMaps.length;
			this.map.getLayers().removeAt(0);
			this.map.getLayers().insertAt(0, this.baseMaps[this.baseMapIndex]);
		},
		changeZoom(delta) {
			const view = this.map.getView();
			view.animate({
				duration: 200,
				zoom: view.getZoom() + delta,
			});
		},
		initMapComponents() {
			this.baseMaps = [
				new TileLayer({ source: new OSM() }),
				new TileLayer({
					source: new XYZ({
						url: 'https://c.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
					}),
				}),
				new TileLayer({ source: new Stamen({ layer: 'toner' }) }),
				new TileLayer({ source: new Stamen({ layer: 'terrain' }) }),
			];
			// TODO attributions
			// CycleOSM: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			// Stamen: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

			this.source = new VectorSource({
				features: this.loadInitFeatures(this.features),
			});

			this.vector = new VectorLayer({
				source: this.source,
				style: (feature, resolution) => {
					// using defaults here, real styling happens in
					// changeFeatureStyle called by loadInitFeatures
					return this.styleFunction();
				},
			});

			this.select = new Select({
				style: null,
				condition: click,
			});

			this.map = new Map({
				target: this.$refs['map-root'],
				layers: [
					this.baseMaps[this.baseMapIndex],
					this.vector
				],
				view: new View({
					center: this.center,
					constrainResolution: true,
					maxZoom: 19,
					zoom: this.zoom,
				}),
			});

			this.map.addInteraction(this.select);
		},
		fitViewToFeatures() {
			// no need to fit view if no feature is present
			if (this.source.getFeatures().length) {
				// fit to selected feature or all features
				const extent = this.getSelectedFeature
					? this.getSelectedFeature.getGeometry().getExtent()
					: this.source.getExtent();

				const leftPadding = (window.innerWidth > 576) ? 400 : 0;

				this.map.getView().fit(extent, {
					duration: 200,
					padding: [0, 0, 0, leftPadding],
				});
			}
		},
		addEventListeners() {
			const selectedFeatures = this.select.getFeatures();
			selectedFeatures.on('add', f => {
				if (f !== this.getSelectedFeature) {
					this.$store.commit('selected/change', f.element);
				}
			});
			selectedFeatures.on('remove', f => {
				this.$store.commit('selected/remove', f.element);
			});

			this.source.on('addfeature', e => {
				const f = e.feature;
				if (!f.getId()) {
					f.setId(new Date().getTime());
				}
				if (this.drawType) {
					// drawn feature
					this.changeFeatureStyle(
						f,
						this.defaultColor[this.drawType] || this.defaultColor.drawing,
						this.defaultStroke.lineDash,
						this.defaultStroke.width,
						true
					);
				} else {
					// imported feature
					this.changeFeatureStyle(
						f,
						f.get('color') || this.defaultColor.drawing,
						this.defaultStroke.lineDash,
						f.get('width') || this.defaultStroke.width,
						true
					);
				}

				this.$store.commit('setDrawType', '');
				this.$store.commit('features/add', f);
				selectedFeatures.push(f);

				if (this.visitor) {
					f.set('visitorFeature', true);
					this.$emit('visitorFeatureAdded', f);
				} else {
					f.set('visitorFeature', false);
				}

				this.$nuxt.$emit('contentModified');
			});

			this.source.on('removefeature', f => {
				if (f.feature === this.getSelectedFeature) {
					this.removeBlur();
				}
				this.$store.commit('selected/remove', f.feature);
				this.$store.commit('features/remove', f.feature);

				if (this.visitor) {
					this.$emit('visitorFeatureRemoved', f.feature);
				}
				this.$nuxt.$emit('contentModified');
			});
		},
		loadInitFeatures(features) {
			// flush the store before initialization
			this.$store.commit('features/clear');
			if (!features) {
				return null;
			}
			for (const f of features) {
				this.$store.commit('features/add', f);
				this.changeFeatureStyle(
					f,
					f.get('color'),
					f.get('dash'),
					f.get('width'),
					false
				); // apply stored style
			}
			return new Collection(features);
		},
		changeFeatureStyle(feature, color, lineDash, strokeWidth, select) {
			feature.set('color', color);
			feature.set('dash', lineDash);
			feature.set('width', strokeWidth);
			this.updateFeatureStyle(feature, select ? feature : null);
		},
		removeBlur(feature = null) {
			if (feature) {
				this.updateFeatureStyle(feature);
			} else {
				this.source.getFeatures().forEach(feature => {
					this.updateFeatureStyle(feature);
				});
			}
		},
		updateFeatureStyle(feature, selFeature) {
			const r = feature.get('rating');
			const rated = Number.isInteger(r) && r !== 0;
			const color = rated ? '#666666' : feature.get('color');

			// lower opacity of unselected features
			const isUnselected = selFeature && selFeature.getId() !== feature.getId();
			const opacity = isUnselected ? '60' : '';

			// raise width of selected features
			const isPoint = feature.getGeometry().constructor.name === 'Point';
			const isSelected = selFeature && selFeature.getId() === feature.getId();
			const addWidth = isSelected && !isPoint && this.visitor ? 5 : 0;

			feature.setStyle(
				this.styleFunction({
					feature,
					pointFillColor: color + opacity,
					lineColor: color + opacity,
					polygonColor: color, // opacity is constant and handled in styleFunction
					lineDash: feature.get('dash'),
					strokeWidth: Number(feature.get('width')) + addWidth,
				})
			);
		},
		styleFunction({
			pointFillColor = this.defaultColor.drawing,
			lineColor = this.defaultColor.drawing,
			polygonColor = this.defaultColor.drawing,
			lineDash = this.defaultStroke.lineDash,
			strokeWidth = this.defaultStroke.width,
		} = {}) {
			return new Style({
				fill: polygonColor
					? new Fill({ color: polygonColor + '15' }) // more transparent fill
					: null,
				stroke: new Stroke({
					color: lineColor,
					lineCap: 'butt',
					lineDash: lineDash.split(',').map(w => Number(w) * strokeWidth),
					width: strokeWidth,
				}),
				image: new CircleStyle({
					radius: strokeWidth * 3,
					fill: pointFillColor ? new Fill({ color: pointFillColor }) : null,
				}),
			});
		},
	},
};
</script>

<style scoped>
.map-zoom-toolbar {
	position: absolute;
	right: 0;
	bottom: 2rem;
}

.btn {
	border-radius: 0.5rem;
	border-top-right-radius: 0px !important;
	border-bottom-right-radius: 0px !important;
	border-right-width: 0px !important;
	font-size: 1.25rem;
}
</style>

<style>
.ol-zoom {
	/* does not work in scoped style block */
	display: none;
}
</style>
