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
import { Draw, Modify, Snap } from 'ol/interaction';
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
	},
	data() {
		return {
			map: null,
			center: this.initialCenter,
			zoom: this.initialZoom,
		};
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

		const modify = new Modify({ source });
		this.map.addInteraction(modify);

		let draw, snap; // global so we can remove them later
		// const typeSelect = document.getElementById('type');

		function addInteractions() {
			draw = new Draw({
				source,
				type: 'Point', // typeSelect.value,
			});
			map.addInteraction(draw);
			snap = new Snap({ source });
			map.addInteraction(snap);
		}

		/* typeSelect.onchange = function () {
			this.map.removeInteraction(draw);
			this.map.removeInteraction(snap);
			addInteractions();
		}; */

		addInteractions();

		source.on('change', () => {
			const f = new GeoJSON().writeFeatures(source.getFeatures());
			console.log('features as geojson', f);
		});
	},
};
</script>
