<template>
	<div>
		<client-only placeholder="Loading...">
			<Map :features="loadInitFeatures()" />
		</client-only>
		<MapToolbar />
		<AdminSidebar
			back-label="Térképek"
			:content-modified="contentModified"
			:loading="loading"
			@back="back"
			@save="save"
		>
			<b-form-group class="mb-4">
				<template #label>
					<h6 class="mb-0">Térkép neve</h6>
				</template>
				<b-form-input
					v-model="mapData.title"
					size="lg"
				/>
			</b-form-group>
			<FeatureList />
		</AdminSidebar>
	</div>
</template>

<script>
import GeoJSON from 'ol/format/GeoJSON';
import { mapGetters, mapMutations } from 'vuex';

export default {
	components: {
		Map: () => (process.client ? import('@/components/Map') : null),
	},
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
			contentModified: false,
			loading: true,
		};
	},
	head() {
		return {
			title: `Admin: ${this.mapData.title}`,
		};
	},
	computed: {
		...mapGetters(['getSidebarVisible']),
		...mapGetters({ getAllFeature: 'features/getAllFeature' }),
	},
	watch: {
		'mapData.title'() {
			this.$nuxt.$emit('contentModified');
		},
	},
	created() {
		this.$nuxt.$on('contentModified', () => {
			this.contentModified = true;
		});
	},
	beforeDestroy() {
		this.$nuxt.$off('contentModified');
	},
	mounted() {
		this.loading = false;
	},
	methods: {
		...mapMutations(['setSidebarVisible']),
		featuresFromRaw(featuresRaw) {
			// TODO this function was copied from Sheet.vue, would be nicer to centralize it...
			const features = JSON.parse(featuresRaw);
			const featureCollection = { type: 'FeatureCollection', features };
			return features ? new GeoJSON().readFeatures(featureCollection) : null;
		},
		async back() {
			if (this.contentModified) {
				const needSave = await this.askSaveModifications();
				if (needSave) {
					await this.save();
				} else if (needSave !== false) {
					return;
				}
			}
			this.$router.push('/admin/maps');
		},
		loadFeaturesFromStore() {
			const features = [];
			for (const f of this.getAllFeature) {
				const featureStr = new GeoJSON().writeFeature(f);
				features.push(JSON.parse(featureStr));
			}
			this.mapData.features = features.length ? features : null;
		},
		loadInitFeatures() {
			return this.featuresFromRaw(this.initMapData.features);
		},
		async save() {
			this.loading = true;
			this.loadFeaturesFromStore();
			try {
				this.mapData = await this.$axios.$patch('/api/map', this.mapData);
				this.contentModified = false;
				this.success('A módosítások mentése sikeres.');
			} catch (error) {
				this.errorToast('A módosítások mentése sikertelen.');
			}
			this.loading = false;
		},
	},
};
</script>
