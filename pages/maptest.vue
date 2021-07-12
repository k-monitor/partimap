<template>
	<div
		class="bg-primary"
		ref="map-root"
		style="width: 100%; height: 100vh"
	/>
</template>

<script>
import 'ol/ol.css';

import View from 'ol/View';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

export default {
	mounted() {
		// eslint-disable-next-line no-new
		new Map({
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
	},
};
</script>
