<template>
	<div>
		<MapNavbar
			:map-title="mapDataLocal.title"
			:map-modified="mapModified"
			@updateTitle="changeMapTitle"
			@back="goToMaps"
			@save="saveFeatures"
		/>
		<div class="flex-grow-1 map">
			<client-only placeholder="Loading...">
				<Map
					:draw-type="drawType"
					:initial-center="[2129152.791287463,6017729.508627875]"
					:initial-zoom="10"
					:features="featuresFromRaw(mapDataServer)"
				/>
			</client-only>
		</div>
		<b-container class="mt-4 mr-2">
			<b-row align-h="end">
				<b-col cols="4" class="p-0">
					<FeatureListContainer
						:map-title="mapDataLocal.title"
						@updateTitle="changeMapTitle"
					/>
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
										Pont
									</b-button>
									<b-button
										:class="{'btn-success': lineBtnClicked}"
										@click="buttonClicked('Line')"
									>
										Útvonal
									</b-button>
									<b-button
										:class="{'btn-success': polyBtnClicked}"
										@click="buttonClicked('Poly')"
									>
										Terület
									</b-button>
								</b-button-group>
							</b-col>
						</b-row>
					</b-card>
				</b-col>
			</b-row>
		</b-container>
		</mapnavbar>
	</div>
</template>

<script>
import GeoJSON from 'ol/format/GeoJSON';
import { mapGetters } from 'vuex';

export default {
	async asyncData({ $axios, store, params, redirect }) {
		store.commit('features/clear');
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
			mapModified: false
		};
	},
	computed: {
		editState() {
			return this.$store.getters.getEditState;
		},
		...mapGetters({ getAllFeature: 'features/getAllFeature' }),

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
		},
	},
	created() {
		this.$nuxt.$on('mapModified', () => {
			this.mapModified = true;
		});
	},
	beforeDestroy() {
		this.$nuxt.$off('mapModified');
	},
	methods: {
		async saveFeatures() { // to DB
			const loadFeaturesFromStore = () => {
				const features = [];
				for (const f of this.getAllFeature) {
					const featureStr = new GeoJSON().writeFeature(f);
					features.push(JSON.parse(featureStr));
				}
				this.mapDataLocal.features = features.length ? features : null;
			};
			loadFeaturesFromStore();
			try {
				this.mapDataServer = await this.$axios.$patch('/api/map', this.mapDataLocal);
				this.mapDataLocal = { ...this.mapDataServer };
				this.success('A módosítások mentése sikeres.');
			} catch (error) {
				this.error('A módosítások mentése sikertelen.');
			}
			this.mapModified = false;
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
		},
		goToMaps() {
			if (this.mapModified) {
				this.showConfirmModal();
			} else {
				this.$router.push('/admin/maps');
			}
		},
		showConfirmModal() {
			this.$bvModal.msgBoxConfirm('Önnek nem mentett módosításai vannak. Kívánja őket menteni?', {
				title: 'Visszalépés',
				size: 'sm',
				buttonSize: 'sm',
				okVariant: 'danger',
				okTitle: 'IGEN',
				cancelTitle: 'NEM',
				footerClass: 'p-2',
				hideHeaderClose: false,
				centered: true,
				autoFocusButton: 'ok'
			})
				.then(value => {
					if (value === true) {
						this.saveFeatures();
						this.$router.push('/admin/maps');
					} else if (value === false) {
						this.$router.push('/admin/maps');
					} // Do nothing on window close or backdrop click
				})
				.catch(err => {
					console.warn(err.message);
					this.error('Sikertelen mentés');
				});
		},
		test() {
			return this.feature.get('color');
		},
		changeMapTitle(title) {
			if (this.mapDataServer.title !== title) {
				this.mapModified = true;
			} else {
				this.mapModified = false;
			}
			this.mapDataLocal.title = title;
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
