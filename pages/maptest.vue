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
								<b-list-group>
									<FeatureListElement
										v-for="wrap in activeFeatureWrap"
										:key="wrap.feature.ol_uid"
										:feature="wrap.feature"
									/>
								</b-list-group>
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
			activeFeatureWrap: [],
		};
	},
	methods: {
		log(payload) {
			console.log('map changed', JSON.stringify(payload));
		},
		logFeature(payload) {
			this.activeFeatureWrap.push(payload);
			// const f = new GeoJSON().writeFeature(payload.feature);
			// console.log(f);
		},
	}
};
</script>
