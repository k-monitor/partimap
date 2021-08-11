<template>
	<div>
		<div class="flex-grow-1 map">
			<client-only placeholder="Loading...">
				<Map
					draw-type="Point"
					:initial-center="[2129152.791287463,6017729.508627875]"
					:initial-zoom="10"
					@change="log"
					@addfeature="logFeature"
				/>
			</client-only>
		</div>
		<b-container class="mt-4 mr-2">
			<FeatureListContainer :active-features="activeFeatures" />
		</b-container>
	</div>
</template>

<script>
// import GeoJSON from 'ol/format/GeoJSON';

export default {
	data() {
		return {
			activeFeatures: [],
		};
	},
	methods: {
		log(payload) {
			console.log('map changed', JSON.stringify(payload));
		},
		logFeature(feature) {
			this.activeFeatures.push(feature);
			// const f = new GeoJSON().writeFeature(payload.feature);
			// console.log(f);
		},
	}
};
</script>

<style scoped>
</style>
