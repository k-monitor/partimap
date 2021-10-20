<template>
	<div>
		<EditorNavbar
			:title-name="mapData.title"
			:dynamic-title="true"
			:content-modified="contentModified"
			@updateTitle="changeMapTitle"
			@back="goBackRoute"
			@save="saveMap"
		>
			<template #back-button-name>Térképek</template>
		</EditorNavbar>
		<MapEditor
			:features="loadInitFeatures()"
		>
			<template #feature-editor>
				<FeatureListContainer />
			</template>
		</MapEditor>
	</div>
</template>

<script>
import GeoJSON from 'ol/format/GeoJSON';
import { mapGetters } from 'vuex';

export default {
	middleware: ['auth'],
	async asyncData({ $axios, store, params, redirect }) {
		store.commit('features/clear');
		try {
			const mapData = await $axios.$get('/api/map/' + params.id);
			return { mapData, initMapData: { ...mapData } };
		} catch (error) {
			redirect('/admin/maps');
		}
	},
	data() {
		return {
			contentModified: false
		};
	},
	head() {
		return {
			title: this.mapData.title,
		};
	},
	computed: {
		...mapGetters({ getAllFeature: 'features/getAllFeature' }),

	},
	created() {
		this.$nuxt.$on('contentModified', () => {
			this.contentModified = true;
		});
	},
	beforeDestroy() {
		this.$nuxt.$off('contentModified');
	},
	methods: {
		featuresFromRaw(featuresRaw) {
			// TODO this function was copied from Sheet.vue, would be nicer to centralize it...
			const features = JSON.parse(featuresRaw);
			const featureCollection = { type: 'FeatureCollection', features };
			return features
				? new GeoJSON().readFeatures(featureCollection)
				: null;
		},
		loadInitFeatures() {
			return this.featuresFromRaw(this.initMapData.features);
		},
		async saveMap() { // to DB
			this.loadFeaturesFromStore();
			try {
				this.mapData = await this.$axios.$patch('/api/map', this.mapData);
				this.success('A módosítások mentése sikeres.');
			} catch (error) {
				this.errorToast('A módosítások mentése sikertelen.');
			}
			this.contentModified = false;
		},
		loadFeaturesFromStore() {
			const features = [];
			for (const f of this.getAllFeature) {
				const featureStr = new GeoJSON().writeFeature(f);
				features.push(JSON.parse(featureStr));
			}
			this.mapData.features = features.length ? features : null;
		},
		showConfirmModal() {
			this.$bvModal.msgBoxConfirm('Önnek nem mentett módosításai vannak. Kívánja őket menteni?', {
				title: 'Visszalépés',
				size: 'sm',
				buttonSize: 'sm',
				okVariant: 'danger',
				okTitle: 'Igen',
				cancelTitle: 'Nem',
				footerClass: 'p-2',
				hideHeaderClose: false,
				centered: true,
				autoFocusButton: 'ok'
			})
				.then(value => {
					if (value === true) {
						this.saveMap();
						this.$router.push('/admin/maps');
					} else if (value === false) {
						this.$router.push('/admin/maps');
					} // Do nothing on window close or backdrop click
				})
				.catch(() => {
					this.errorToast('Sikertelen mentés');
				});
		},
		goBackRoute() {
			if (this.contentModified) {
				this.showConfirmModal();
			} else {
				this.$router.push('/admin/maps');
			}
		},
		changeMapTitle(title) {
			if (this.mapData.title !== title) {
				this.mapData.title = title;
			}
		}
	}
};
</script>
