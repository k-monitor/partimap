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
		editMode: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			map: null,
			center: this.initialCenter,
			zoom: this.initialZoom,
			styleFunction({
				feature = null,
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
			}

		};
	},
	watch: {
		drawType(type) {
			this.setDrawType(type);
		},
		editMode(editMode) {
			editMode ? this.map.removeInteraction(this.select) : this.map.addInteraction(this.select);
		}
	},
	mounted() {
		const raster = new TileLayer({
			source: new OSM(),
		});

		this.source = new VectorSource();
		this.vector = new VectorLayer({
			source: this.source,
			style: (feature, resolution) => {
				feature.set('color', '#64C8FF');
				return this.styleFunction({
					feature,
					pointFillColor: '#64C8FF',
					lineColor: '#64C8FF',
					polygonColor: '#64C8FF'
				});
			}
		});

		const collection = new Collection();
		this.select = new Select({
			features: collection,
			style: null
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

		const selectedFeatures = this.select.getFeatures();
		selectedFeatures.on('add', f => {
			console.log(f);
			console.log(this.source.getFeatures());
			if (selectedFeatures.getLength() === 2) {
				selectedFeatures.removeAt(0);
			}
			this.source.getFeatures().forEach(feature => {
				if (feature !== f.element) {
					this.blurFeature(feature);
				}
			});
			this.$nuxt.$emit('selectionChanged', selectedFeatures);
		});
		selectedFeatures.on('remove', f => {
			this.$nuxt.$emit('selectionChanged', selectedFeatures);
			this.removeBlur();
		});
		this.source.on('addfeature', f => {
			this.$emit('featuresChanged', f.feature);
		});
		this.source.on('removefeature', f => {
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
		this.$nuxt.$on('clearFeature', feature => {
			this.vector.getSource().removeFeature(feature);
		});
		this.$nuxt.$on('changeStyle', (feature, color) => {
			this.changeFeatureStyle(feature, color);
		});
	},
	beforeDestroy() {
		this.$nuxt.$off('featureClickedOnList');
		this.$nuxt.$off('clearFeature');
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
		changeFeatureStyle(feature, color) {
			// if there is a specified color, set the color to that,
			// if there isn't, use the feature's default color
			feature.setStyle(this.styleFunction({
				feature,
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
		removeBlur() {
			this.source.getFeatures().forEach(feature => {
				feature.setStyle(this.styleFunction({
					feature,
					pointFillColor: feature.get('color'),
					lineColor: feature.get('color'),
					polygonColor: feature.get('color')
				}));
			});
		}
	}
};
</script>
