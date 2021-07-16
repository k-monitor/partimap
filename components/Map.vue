/*
	Use only inside <client-only> </client-only> tags!
*/

<template>
	<div
		ref="map-root"
		class="h-100 position-absolute w-100"
	/>
</template>

<script>
import 'ol/ol.css';

import Map from 'ol/Map';
import View from 'ol/View';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Draw, Snap } from 'ol/interaction';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';

const raster = new TileLayer({
	source: new OSM(),
});

const source = new VectorSource();
const vector = new VectorLayer({
	source,
	style: new Style({
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
	}),
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
		};
	},
	watch: {
		drawType(type) {
			this.setDrawType(type);
		},
	},
	mounted() {
		const { center, zoom } = this;
		const map = new Map({
			target: this.$refs['map-root'],
			layers: [raster, vector],
			view: new View({
				center,
				constrainResolution: true,
				zoom,
			}),
		});
		this.map = map;

		this.map.on('moveend', () => {
			this.center = this.map.getView().getCenter();
			this.zoom = this.map.getView().getZoom();
			const { center, zoom } = this;
			this.$emit('change', {
				center,
				zoom,
			});
		});

		source.on('addfeature', e => {
			const f = new GeoJSON().writeFeature(e.feature);
			this.$emit('addfeature', f);
		});

		this.setDrawType(this.drawType);
	},
	methods: {
		setDrawType(type) {
			this.map.removeInteraction(draw);
			this.map.removeInteraction(snap);
			if (type) {
				draw = new Draw({ source, type });
				this.map.addInteraction(draw);
				snap = new Snap({ source });
				this.map.addInteraction(snap);
			}
		},
	},
};
</script>
