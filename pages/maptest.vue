<template>
	<div>
		<div class="flex-grow-1 map">
			<client-only placeholder="Loading...">
				<Map
					draw-type="Point"
					:initial-center="[2129152.791287463,6017729.508627875]"
					:initial-zoom="10"
					@change="log"
					@featuresChanged="updateFeatures"
				/>
			</client-only>
		</div>
		<b-container class="mt-4 mr-2">
			<FeatureListContainer :all-features="allFeatures" />
		</b-container>
	</div>
</template>

<script>
// import GeoJSON from 'ol/format/GeoJSON';

export default {
	data() {
		return {
			allFeatures: [],
		};
	},
	methods: {
		log(payload) {
			console.log('map changed', JSON.stringify(payload));
		},
		updateFeatures(feature) {
			const idx = this.allFeatures.indexOf(feature);
			if (idx === -1) {
				this.allFeatures.push(feature);
			} else {
				this.allFeatures.splice(idx, 1);
			}
		}
	}
};
</script>

<style scoped>
</style>
