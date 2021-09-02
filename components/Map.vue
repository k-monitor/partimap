/*
	Use only inside <client-only> </client-only> tags!
*/

<template>
	<div>
		<div ref="map-root" class="h-100 position-absolute w-100 map" />
	</div>
</template>

<script>
import 'ol/ol.css';

import Map from 'ol/Map';
import View from 'ol/View';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Draw, Select, Snap } from 'ol/interaction';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { mapGetters } from 'vuex';
import Collection from 'ol/Collection';
import Feature from 'ol/Feature';
import { click } from 'ol/events/condition';

let draw, snap;

export default {
	props: {
		initialCenter: {
			type: Array,
			default: () => [0, 0],
		},
		initialZoom: {
			type: Number,
			default: 3,
		},
		features: {
			type: Array,
			default: null,
			validator: container => container.every(f => f instanceof Feature)
		}
	},
	data() {
		return {
			map: null,
			center: this.initialCenter,
			zoom: this.initialZoom,
			defaultColor: '#000080',
			drawType: ''
		};
	},
	computed: {
		editState() {
			return this.$store.getters.getEditState;
		},
		...mapGetters({ getSelectedFeature: 'selected/getSelectedFeature' })

	},
	watch: {
		drawType(type) {
			this.setDrawType(type);
		},
		editState(state) {
			state ? this.map.removeInteraction(this.select) : this.map.addInteraction(this.select);
		},
		getSelectedFeature(selFeature, prevFeature) {
			// sync the local selectedFeatures collection with the store
			const selectedFeatures = this.select.getFeatures();
			if (selFeature && !selectedFeatures.array_.includes(selFeature)) {
				selectedFeatures.push(selFeature);
			}
			if (selectedFeatures.array_.includes(prevFeature)) {
				selectedFeatures.remove(prevFeature);
			}
			if (!selFeature) {
				this.removeBlur();
				this.select.getFeatures().pop(); // if a feature is unselected, also clear it from here
			} else {
				this.source.getFeatures().forEach(feature => {
					if (feature !== selFeature) {
						this.blurFeature(feature);
					} if ((feature === selFeature) && prevFeature) {
						this.removeBlur(selFeature);
					}
				});
			}
		}
	},
	mounted() {
		const { center, zoom } = this;
		const raster = new TileLayer({
			source: new OSM(),
		});

		this.source = new VectorSource({
			features: this.loadInitFeatures(this.features)
		});

		this.vector = new VectorLayer({
			source: this.source,
			style: (feature, resolution) => {
				return this.styleFunction({
					feature,
					pointFillColor: this.defaultColor,
					lineColor: this.defaultColor,
					polygonColor: this.defaultColor
				});
			}
		});
		this.select = new Select({
			style: null,
			condition: click
		});

		this.map = new Map({
			target: this.$refs['map-root'],
			layers: [raster, this.vector],
			view: new View({
				center,
				constrainResolution: true,
				zoom,
			}),
		});
		this.fitViewToFeatures();

		this.map.on('moveend', () => {
			this.center = this.map.getView().getCenter();
			this.zoom = this.map.getView().getZoom();
			const { center, zoom } = this;
			this.$emit('change', {
				center,
				zoom,
			});
		});

		const selectedFeatures = this.select.getFeatures();
		selectedFeatures.on('add', f => {
			if (f !== this.getSelectedFeature) {
				this.$store.commit('selected/change', f.element);
			}
		});
		selectedFeatures.on('remove', f => {
			this.$store.commit('selected/remove', f.element);
		});

		this.source.on('addfeature', f => {
			f.feature.setId(new Date().getTime());
			f.feature.set('color', this.defaultColor);
			this.$store.commit('toggleEditState', false);
			this.$store.commit('features/add', f.feature);

			selectedFeatures.push(f.feature);
			this.$nuxt.$emit('mapModified');
		});

		this.source.on('removefeature', f => {
			if (f.feature === this.getSelectedFeature) {
				this.removeBlur();
			}
			this.$store.commit('selected/remove', f.feature);
			this.$store.commit('features/remove', f.feature);
			this.$nuxt.$emit('mapModified');
		});

		this.setDrawType(this.drawType);
	},
	created() {
		this.$nuxt.$on('clearFeature', feature => {
			this.vector.getSource().removeFeature(feature);
		});
		this.$nuxt.$on('changeStyle', (feature, color) => {
			this.changeFeatureStyle(feature, color);
		});
		this.$nuxt.$on('drawType', type => {
			this.drawType = type;
		});
	},
	beforeDestroy() {
		this.$nuxt.$off('clearFeature');
		this.$nuxt.$off('changeStyle');
		this.$nuxt.$off('drawType');
	},
	methods: {
		loadInitFeatures(features) {
			if (!features) {
				return null;
			}
			for (const f of features) {
				this.$store.commit('features/add', f);
				this.changeFeatureStyle(f, f.get('color')); // apply stored color
			}
			return new Collection(features);
		},
		styleFunction({
			pointFillColor = null,
			lineColor = null,
			polygonColor = null
		} = {}) {
			return new Style({
				fill: polygonColor
					? new Fill({ color: polygonColor + '33' })
					: null,
				stroke: new Stroke({
					color: lineColor,
					width: 2,
				}),
				image: new CircleStyle({
					radius: 7,
					fill: pointFillColor
						? new Fill({ color: pointFillColor })
						: null,
				}),
			});
		},
		setDrawType(type) {
			this.map.removeInteraction(draw);
			this.map.removeInteraction(snap);
			if (type) {
				draw = new Draw({
					source: this.source, type
				});
				this.map.addInteraction(draw);
				snap = new Snap({ source: this.source });
				this.map.addInteraction(snap);
			}
		},
		changeFeatureStyle(feature, color) {
			feature.setStyle(this.styleFunction({
				pointFillColor: color,
				lineColor: color,
				polygonColor: color
			}));
			feature.set('color', color);
		},
		blurFeature(feature) {
			feature.setStyle(this.styleFunction({
				feature,
				pointFillColor: feature.get('color') + '80',
				lineColor: feature.get('color') + '80',
				polygonColor: feature.get('color')
			}));
		},
		removeBlur(feature = null) {
			if (feature) {
				this.changeFeatureStyle(feature, feature.get('color'));
			} else {
				this.source.getFeatures().forEach(feature => {
					this.changeFeatureStyle(feature, feature.get('color'));
				});
			}
		},
		fitViewToFeatures() {
			// no need to fit view if 0 or 1 feature is present
			if (this.source.getFeatures().length > 1) {
				// padding, so the feature list and navbar doesn't block the view from features
				this.map.getView().fit(this.source.getExtent(), { padding: [80, 300, 0, 0] });
			}
		}
	}
};
</script>

<style>

.ol-zoom {
	top: 6.5em;
}
</style>
