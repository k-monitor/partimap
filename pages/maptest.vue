<template>
	<div>
		<input
			v-model="zoom"
			type="number"
		>
		<div
			ref="map-root"
			class="bg-primary"
			style="width: 100%; height: 100vh"
		/>
	</div>
</template>

<script>
import 'ol/ol.css';

import View from 'ol/View';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

export default {
	data() {
		return {
			map: null,
			zoom: 0,
		};
	},
	watch: {
		zoom(zoom) {
			this.map.getView().animate({
				zoom,
				duration: 250,
			});
		},
	},
	mounted() {
		this.map = new Map({
			target: this.$refs['map-root'],
			layers: [
				new TileLayer({
					source: new OSM(),
				}),
			],
			view: new View({
				zoom: 0,
				center: [0, 0],
				constrainResolution: true,
			}),
		});

		this.map.on('moveend', () => {
			this.zoom = this.map.getView().getZoom();
		});
	},
};
</script>
