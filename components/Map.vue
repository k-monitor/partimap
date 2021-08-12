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
import { Draw, Select, Snap, defaults as defaultInteractions } from 'ol/interaction';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Collection from 'ol/Collection';

const raster = new TileLayer({
	source: new OSM(),
});

const source = new VectorSource();
const vector = new VectorLayer({
	source,
	style(feature) {
		return new Style({
			fill: new Fill({
				color: 'rgba(255, 255, 255, 0.2)',
			}),
			stroke: new Stroke({
				color: '#ffcc33',
				width: 2,
			}),
			image: new CircleStyle({
				radius: 7,
				fill: new Fill({
					color: '#ffcc33',
				}),
			}),
		});
	}
});

let draw, snap;

export default {
	props: {
		drawType: {
			type: String,
			default: null,
			validator(value) {
				return [null, false, '', 'Point', 'LineString', 'Polygon'].includes(
					value
				);
			},
		},
		initialCenter: {
			type: Array,
			default: () => [0, 0],
		},
		initialZoom: {
			type: Number,
			default: 3,
		},
	},
	data() {
		return {
			map: null,
			center: this.initialCenter,
			zoom: this.initialZoom,
			selectedFeatures: {},
		};
	},
	watch: {
		drawType(type) {
			this.setDrawType(type);
		},
	},
	mounted() {
		const collection = new Collection();
		this.select = new Select({
			features: collection,
			style: new Style({
				fill: new Fill({
					color: 'rgba(100, 255, 255, 0.2)',
				}),
				stroke: new Stroke({
					color: '#afcc33',
					width: 2,
				}),
				image: new CircleStyle({
					radius: 7,
					fill: new Fill({
						color: '#ebbb',
					}),
				}),
			}),
		});
		const { center, zoom } = this;
		this.map = new Map({
			interactions: defaultInteractions().extend([this.select]),
			target: this.$refs['map-root'],
			layers: [raster, vector],
			view: new View({
				center,
				constrainResolution: true,
				zoom,
			}),
		});

		this.map.on('moveend', () => {
			this.center = this.map.getView().getCenter();
			this.zoom = this.map.getView().getZoom();
			const { center, zoom } = this;
			this.$emit('change', {
				center,
				zoom,
			});
		});

		const { selectedFeatures } = this;
		const featuresCollection = this.select.getFeatures();
		featuresCollection.on('add', f => {
			selectedFeatures[f.element.ol_uid] = f.element;
			this.$nuxt.$emit('selectionChanged', selectedFeatures);
		});
		featuresCollection.on('remove', f => {
			delete selectedFeatures[f.element.ol_uid];
			this.$nuxt.$emit('selectionChanged', selectedFeatures);
		});
		source.on('addfeature', f => {
			this.$emit('featuresChanged', f.feature);
			console.log(vector);
		});
		source.on('removefeature', f => {
			delete selectedFeatures[f.feature.ol_uid];
			this.$emit('featuresChanged', f.feature);
		});
		this.setDrawType(this.drawType);
	},
	created() {
		this.$nuxt.$on('featureClickedOnList', f => {
			const features = this.select.getFeatures();
			if (!features.remove(f)) {
				features.push(f);
			}
		});
		this.$nuxt.$on('clearFeatures', feature => {
			let featuresToClear = {};
			if (!feature) { // if no features are specified, clear all selected
				featuresToClear = this.selectedFeatures;
			} else {
				featuresToClear = feature;
			}
			this.$nuxt.$emit('clearFeaturesFromList', featuresToClear);
			for (const f of Object.values(featuresToClear)) {
				try {
					vector.getSource().removeFeature(f);
				} catch (error) {
					delete featuresToClear[f.ol_uid];
				}
			}
		});
		this.$nuxt.$on('changeStyle', (feature, color) => {
			this.changeFeatureStyle(feature, color);
		});
	},
	beforeDestroy() {
		this.$nuxt.$off('featureClickedOnList');
		this.$nuxt.$off('clearFeatures');
	},
	methods: {
		setDrawType(type) {
			this.map.removeInteraction(draw);
			this.map.removeInteraction(snap);
			if (type) {
				draw = new Draw({
					source, type
				});
				this.map.addInteraction(draw);
				snap = new Snap({ source });
				this.map.addInteraction(snap);
			}
		},
		changeFeatureStyle(feature, color) {
			console.log(feature);
			const newStyle = new Style({
				image: new CircleStyle({
					radius: 7,
					fill: new Fill({ color }),
				})
			});
			feature.setStyle(newStyle);
		}
	}
};
</script>
