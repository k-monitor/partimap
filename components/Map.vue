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

import View from 'ol/View';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

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
			zoom: this.initialZoom
		};
	},
	mounted() {
		const { center, zoom } = this;
		this.map = new Map({
			target: this.$refs['map-root'],
			layers: [
				new TileLayer({
					source: new OSM(),
				}),
			],
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
				zoom
			});
		});
	},
};
</script>
