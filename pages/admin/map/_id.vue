<template>
	<div>
		<MapNavbar
			:map-title="mapDataLocal.title"
			:map-modified="mapModified"
			@updateTitle="changeMapTitle"
			@back="goToMaps"
			@save="saveFeatures"
		/>
		<client-only placeholder="Loading...">
			<Map
				:initial-center="[2129152.791287463,6017729.508627875]"
				:initial-zoom="10"
				:features="featuresFromRaw(mapDataServer)"
			/>
		</client-only>
		<b-container class="mt-11 mx-0 ml-auto px-0 px-sm-3 feature-container">
			<FeatureListContainer
				:map-title="mapDataLocal.title"
				@updateTitle="changeMapTitle"
			/>
		</b-container>
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
			mapModified: false
		};
	},
	head() {
		return {
			title: this.mapDataServer.title,
		};
	},
	computed: {
		...mapGetters({ getAllFeature: 'features/getAllFeature' }),

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

.mt-11, .my-11 {
    margin-top: 6.5rem !important;
}

.feature-container {
	width: 35%;
	box-sizing: content-box;
	min-width: 180px;
	max-width: 300px;
}
</style>
