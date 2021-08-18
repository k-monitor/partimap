<template>
	<div>
		<div class="flex-grow-1 map">
			<client-only placeholder="Loading...">
				<Map
					v-if="featuresLoaded"
					:draw-type="drawType"
					:initial-center="[2129152.791287463,6017729.508627875]"
					:initial-zoom="10"
					:features="featuresFromServer"
					@change="log"
					@featuresChanged="updateFeatures"
				/>
			</client-only>
		</div>
		<b-container class="mt-4 mr-2">
			<b-row align-h="end">
				<b-col cols="4" class="p-0">
					<FeatureListContainer :all-features="allFeatures" />
				</b-col>
			</b-row>
		</b-container>
		<b-container class="fixed-bottom mb-5 mr-2">
			<b-row align-h="end">
				<b-col cols="auto">
					<b-card>
						<b-container class="text-center">
							<b-button-group>
								<b-button
									:class="{'btn-success': pointBtnClicked}"
									@click="buttonClicked('Point')"
								>
									Point
								</b-button>
								<b-button
									:class="{'btn-success': lineBtnClicked}"
									@click="buttonClicked('Line')"
								>
									Line
								</b-button>
								<b-button
									:class="{'btn-success': polyBtnClicked}"
									@click="buttonClicked('Poly')"
								>
									Polygon
								</b-button>
							</b-button-group>
						</b-container>
					</b-card>
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
			allFeatures: [],
			drawType: '',
			pointBtnClicked: false,
			lineBtnClicked: false,
			polyBtnClicked: false,
			featuresLoaded: false,
			featuresFromServer: []
		};
	},
	computed: {
		editState() {
			return this.$store.getters.getEditState;
		}
	},
	watch: {
		drawType() {
			this.$store.commit('toggleEditState', !!this.drawType);
			!!this.drawType && this.$store.commit('selected/change', null);
		},
		editState(state) {
			if (!state) {
				this.pointBtnClicked = this.lineBtnClicked = this.polyBtnClicked = false;
				this.drawType = '';
			}
		}
	},
	mounted() {
		this.loadFeatures();
	},
	methods: {
		async loadFeatures() {
			try {
				const data = await fetch('http://localhost:8080/features');
				if (!data.ok) {
					throw new Error('error when loading data');
				}
				this.featuresFromServer = await data.json();
				this.featuresLoaded = true;
			} catch (error) {
				console.log(error.message);
			}
		},
		log(payload) {
			// console.log('map changed', JSON.stringify(payload));
		},
		updateFeatures(feature) {
			const idx = this.allFeatures.indexOf(feature);
			if (idx === -1) {
				this.allFeatures.push(feature);
			} else {
				this.allFeatures.splice(idx, 1);
			}
		},
		buttonClicked (type) {
			switch (type) {
			case 'Point':
				this.drawType === 'Point' ? this.drawType = '' : this.drawType = 'Point';
				this.pointBtnClicked = !this.pointBtnClicked;
				this.lineBtnClicked = false;
				this.polyBtnClicked = false;
				break;
			case 'Line':
				this.drawType === 'LineString' ? this.drawType = '' : this.drawType = 'LineString';
				this.lineBtnClicked = !this.lineBtnClicked;
				this.pointBtnClicked = false;
				this.polyBtnClicked = false;
				break;
			case 'Poly':
				this.drawType === 'Polygon' ? this.drawType = '' : this.drawType = 'Polygon';
				this.polyBtnClicked = !this.polyBtnClicked;
				this.lineBtnClicked = false;
				this.pointBtnClicked = false;
				break;
			}
		}
	}
};
</script>

<style scoped>

/* Erre lehet létezik jobb megoldás.. Mivel fixed a position-je a divnek, így
nem lehet rajta átkattintani. */
.fixed-bottom {
	pointer-events: none;
}
.fixed-bottom .card-body {
	pointer-events: all;
}
</style>
