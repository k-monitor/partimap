<template>
	<div>
		<div class="flex-grow-1 map">
			<client-only placeholder="Loading...">
				<Map
					:draw-type="drawType"
					:initial-center="[2129152.791287463,6017729.508627875]"
					:initial-zoom="10"
					:features="featuresFromRaw(mapDataLocal)"
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
import GeoJSON from 'ol/format/GeoJSON';

export default {
	async asyncData({ $axios, params, redirect }) {
		try {
			const mapDataServer = await $axios.$get('/api/map/' + params.id);
			return { mapDataServer, mapDataLocal: { ...mapDataServer } };
		} catch (error) {
			redirect('/admin/maps');
		}
	},
	data() {
		return {
			drawType: '',
			pointBtnClicked: false,
			lineBtnClicked: false,
			polyBtnClicked: false,
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
	methods: {
		async saveFeatures() {
			try {
				this.mapDataServer = await this.$axios.$patch('/api/map', this.mapDataLocal);
				this.mapDataLocal = { ...this.mapDataServer };
				this.success('Modification successful');
			} catch (error) {
				this.error('Modification failed');
			}
		},
		featuresFromRaw(featuresRaw) {
			const featuresJSON = JSON.parse(featuresRaw.features);
			const geoJSONify = featuresJSON => {
				return { type: 'FeatureCollection', features: featuresJSON };
			};

			if (!featuresJSON) {
				return null;
			}
			const features = new GeoJSON().readFeatures(geoJSONify(featuresJSON));
			console.log(features);
			return features;
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
