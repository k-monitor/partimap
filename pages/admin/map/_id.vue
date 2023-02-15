<template>
	<div>
		<client-only>
			<Map
				:key="$route.path"
				:features="loadInitFeatures()"
			/>
		</client-only>
		<MapToolbar />
		<MapHint />
		<Sidebar
			admin
			:back-label="$t('mapEditor.back')"
			:content-modified="contentModified"
			:loading="loading"
			@back="back"
			@save="save"
		>
			<b-form-group class="mb-4">
				<template #label>
					<h6 class="mb-0">{{ $t('mapEditor.name') }}</h6>
				</template>
				<b-form-input
					v-model="mapData.title"
					size="lg"
				/>
			</b-form-group>
			<FeatureList />
		</Sidebar>
	</div>
</template>

<script>
import GeoJSON from 'ol/format/GeoJSON';
import { mapGetters } from 'vuex';

export default {
	components: {
		Map: () => (process.client ? import('@/components/Map') : null),
	},
	middleware: ['auth'],
	async asyncData({ $axios, store, params, redirect }) {
		store.commit('features/clear');
		try {
			const mapData = await $axios.$get('/api/map/' + params.id);
			return { mapData };
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
		...mapGetters('features', ['getAllFeature']),
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
		this.$store.commit('selected/clear');
		this.loading = false;
	},
	methods: {
		back() {
			this.$router.push(this.localePath('/admin/maps'));
		},
		featuresFromRaw(featuresRaw) {
			// TODO this function was copied from Sheet.vue, would be nicer to centralize it...
			const features = JSON.parse(featuresRaw);
			const featureCollection = { type: 'FeatureCollection', features };
			return features
				? new GeoJSON().readFeatures(featureCollection)
				: null;
		},
		loadFeaturesFromStore() {
			const features = [];
			for (const f of this.getAllFeature) {
				const featureStr = new GeoJSON().writeFeature(f);
				features.push(JSON.parse(featureStr));
			}
			this.mapData.features = JSON.stringify(features);
		},
		loadInitFeatures() {
			return this.featuresFromRaw(this.mapData.features);
		},
		async save() {
			this.loading = true;
			this.loadFeaturesFromStore();
			try {
				this.mapData = await this.$axios.$patch(
					'/api/map',
					this.mapData
				);
				this.contentModified = false;
				this.success(this.$t('mapEditor.success'));
			} catch (error) {
				this.errorToast(this.$t('mapEditor.error'));
			}
			this.loading = false;
		},
	},
};
</script>
