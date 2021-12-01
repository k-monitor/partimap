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
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Collection from 'ol/Collection';
import Feature from 'ol/Feature';
import { click } from 'ol/events/condition';

export default {
	props: {
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
			// either be 'Point','LineString', or 'Polygon'
			// drawType: '',
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
					if (feature !== selFeature) {
						this.blurFeature(feature);
					}
					if (feature === selFeature && prevFeature) {
						this.removeBlur(selFeature);
					}
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
			this.changeFeatureStyle(feature, color, dash, width);
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
		changeZoom(delta) {
			const view = this.map.getView();
			view.animate({
				duration: 200,
				zoom: view.getZoom() + delta,
			});
		},
		initMapComponents() {
			const raster = new TileLayer({
				source: new OSM(),
			});

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
				layers: [raster, this.vector],
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

				this.map.getView().fit(extent, {
					duration: 200,
					padding: [100, 100, 100, 100],
				});
			}
		},
		addEventListeners() {
			const selectedFeatures = this.select.getFeatures();
			selectedFeatures.on('add', f => {
				if (f !== this.getSelectedFeature) {
					this.$store.commit('selected/change', f.element);
					this.$store.commit('setSidebarVisible', true);
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
						this.defaultStroke.width
					);
				} else {
					// imported feature
					this.changeFeatureStyle(
						f,
						f.get('color') || this.defaultColor.drawing,
						this.defaultStroke.lineDash,
						f.get('width') || this.defaultStroke.width
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
					f.get('width')
				); // apply stored style
			}
			return new Collection(features);
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
		changeFeatureStyle(feature, color, lineDash, strokeWidth) {
			// console.log('changeFeatureStyle', color, lineDash, strokeWidth);
			feature.setStyle(
				this.styleFunction({
					pointFillColor: color,
					lineColor: color,
					polygonColor: color,
					lineDash,
					strokeWidth,
				})
			);
			feature.set('color', color);
			feature.set('dash', lineDash);
			feature.set('width', strokeWidth);
		},
		blurFeature(feature) {
			feature.setStyle(
				this.styleFunction({
					feature,
					pointFillColor: feature.get('color') + '80', // opacity level
					lineColor: feature.get('color') + '80',
					polygonColor: feature.get('color'),
					lineDash: feature.get('dash'),
					strokeWidth: feature.get('width'),
				})
			);
		},
		removeBlur(feature = null) {
			if (feature) {
				this.changeFeatureStyle(
					feature,
					feature.get('color'),
					feature.get('dash'),
					feature.get('width')
				);
			} else {
				this.source.getFeatures().forEach(feature => {
					this.changeFeatureStyle(
						feature,
						feature.get('color'),
						feature.get('dash'),
						feature.get('width')
					);
				});
			}
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
