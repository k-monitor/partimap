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
import { click } from 'ol/events/condition';
import Collection from 'ol/Collection';

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
			styleFunction({
				feature = null,
				resolution = null,
				pointFillColor = null,
				selected = false,
				lineColor = null,
				polygonColor = null
			} = {}) {
				switch (feature.getGeometry().getType()) {
				case 'Polygon':
					feature.set('color', polygonColor);
					break;
				case 'LineString':
					feature.set('color', lineColor);
					break;
				case 'Point':
					feature.set('color', pointFillColor);
					break;
				}
				return new Style({
					fill: polygonColor
						? new Fill({ color: polygonColor + '80' })
						: null,
					stroke: new Stroke({
						color: selected ? '#ff0000' : lineColor,
						width: 2,
						lineDash: (selected && feature.getGeometry().getType() === 'LineString') ? [4, 8] : null
					}),
					image: new CircleStyle({
						radius: 7,
						fill: pointFillColor
							? new Fill({ color: pointFillColor })
							: null,
						stroke: selected
							? new Stroke({ color: 'black' })
							: null
					}),
				});
			}

		};
	},
	watch: {
		drawType(type) {
			this.setDrawType(type);
		},
	},
	mounted() {
		const raster = new TileLayer({
			source: new OSM(),
		});

		this.source = new VectorSource();
		this.vector = new VectorLayer({
			source: this.source,
			style: (feature, resolution) => {
				return this.styleFunction({
					feature,
					resolution,
					pointFillColor: 'yellow',
					lineColor: '#64C8FF',
					polygonColor: '#64C8FF'
				});
			}
		});

		const collection = new Collection();
		this.select = new Select({
			features: collection,
			style: (feature, resolution) => {
				return this.styleFunction({
					feature,
					resolution,
					pointFillColor: feature.get('color'),
					polygonColor: feature.get('color'),
					lineColor: 'red',
					selected: true,
				});
			},
			condition: click
		});
		const { center, zoom } = this;
		this.map = new Map({
			interactions: defaultInteractions().extend([this.select]),
			target: this.$refs['map-root'],
			layers: [raster, this.vector],
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
			f.element.set('selected', true);
			selectedFeatures[f.element.ol_uid] = f.element;
			this.$nuxt.$emit('selectionChanged', selectedFeatures);
		});
		featuresCollection.on('remove', f => {
			f.element.set('selected', false);
			this.changeFeatureStyle(f.element);
			delete selectedFeatures[f.element.ol_uid];
			this.$nuxt.$emit('selectionChanged', selectedFeatures);
		});
		this.source.on('addfeature', f => {
			this.$emit('featuresChanged', f.feature);
		});
		this.source.on('removefeature', f => {
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
					this.vector.getSource().removeFeature(f);
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
					source: this.source, type
				});
				this.map.addInteraction(draw);
				snap = new Snap({ source: this.source });
				this.map.addInteraction(snap);
			}
		},
		changeFeatureStyle(feature, color = null) {
			// if there is a specified color, set the color to that,
			// if there isn't, use the feature's default color
			if (!color) {
				console.log('selection removed, changing style to ' + feature.get('color'));
			}
			feature.setStyle(this.styleFunction({
				feature,
				pointFillColor: color || feature.get('color'),
				selected: feature.get('selected'),
				lineColor: color || feature.get('color'),
				polygonColor: color || feature.get('color')
			}));
		},
	}
};
</script>
