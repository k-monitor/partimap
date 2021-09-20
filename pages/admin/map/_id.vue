<template>
	<div>
		<EditorNavbar
			:title="mapData.title"
			:dynamic-title="true"
			@updateTitle="changeMapTitle"
			@back="$router.push('/admin/maps')"
			@unsavedChanges="showConfirmModal"
			@save="saveMap"
		>
			<template #back-button-name>Térképek</template>
		</EditorNavbar>
		<MapEditor
			:features-raw="initMapData.features"
		/>
	</div>
</template>

<script>
import GeoJSON from 'ol/format/GeoJSON';
import { mapGetters } from 'vuex';

export default {
	async asyncData({ $axios, store, params, redirect }) {
		store.commit('features/clear');
		try {
			const mapData = await $axios.$get('/api/map/' + params.id);
			return { mapData, initMapData: { ...mapData } };
		} catch (error) {
			redirect('/admin/maps');
		}
	},
	head() {
		return {
			title: this.mapData.title,
		};
	},
	computed: {
		...mapGetters({ getAllFeature: 'features/getAllFeature' }),

	},
	methods: {
		async saveMap() { // to DB
			this.loadFeaturesFromStore();
			try {
				this.mapData = await this.$axios.$patch('/api/map', this.mapData);
				this.success('A módosítások mentése sikeres.');
			} catch (error) {
				this.error('A módosítások mentése sikertelen.');
			}
			this.$nuxt.$emit('mapSaved');
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
				okTitle: 'IGEN',
				cancelTitle: 'NEM',
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
					this.error('Sikertelen mentés');
				});
		},
		changeMapTitle(title) {
			if (this.mapData.title !== title) {
				this.mapData.title = title;
			}
		}
	}
};
</script>
