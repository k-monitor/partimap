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
				/>
			</client-only>
		</div>
		<b-container class="mt-4 mr-2">
			<b-row align-h="end">
				<b-col cols="4" class="p-0">
					<FeatureListContainer />
				</b-col>
			</b-row>
		</b-container>
		<b-container class="fixed-bottom mb-5 mr-2">
			<b-row align-h="end">
				<b-col cols="auto">
					<b-card>
						<b-row>
							<b-col>
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
							</b-col>
						</b-row>
						<b-row class="mt-1" align-h="between">
							<b-col cols="6">
								<b-button variant="success" @click="saveFeatures"> Mentés </b-button>
							</b-col>
							<b-col cols="6" class="text-right">
								<b-button variant="info"> Vissza </b-button>
							</b-col>
						</b-row>
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
		async loadFeatures() { // TODO axios
			try {
				const data = await fetch('http://localhost:8080/features');
				if (!data.ok) {
					throw new Error('Error when loading data from features DB');
				}
				this.featuresFromServer = await data.json();
			} catch (error) {
				console.log(error.message);
				this.featuresFromServer = [];
			}
			this.featuresLoaded = true;
		},
		async saveFeatures() {
			try {
				await this.$axios.$patch('');
			} catch (error) {
				this.error('Failed to save features');
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
