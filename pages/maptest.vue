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
			<b-row align-h="end">
				<b-col cols="4">
					<div>
						<b-card title="Card title" sub-title="Card subtitle">
							<b-card-text>
								<div v-for="f in activeFeatures" :key="f.feature.ol_uid">
									<p @click="selectFeature(f.feature)">{{ f.feature.getGeometry().getType() }}</p>
								</div>
							</b-card-text>
						</b-card>
					</div>
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
// import GeoJSON from 'ol/format/GeoJSON';

export default {
	data() {
		return {
			activeFeatures: [],
			selectedFeature: ''
		};
	},
	methods: {
		log(payload) {
			console.log('map changed', JSON.stringify(payload));
		},
		logFeature(payload) {
			this.activeFeatures.push(payload);
			// const f = new GeoJSON().writeFeature(payload.feature);
			// console.log(f);
		},
		selectFeature(f) {
			this.$nuxt.$emit('featureClickedOnList', f);
		}
	}
};
</script>

<style scoped>
</style>
