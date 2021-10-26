<template>
	<div>
		<MapEditor :features="loadInitFeatures()">
			<template #feature-editor>
				<FeatureListContainer />
			</template>
		</MapEditor>
		<!--<h1
			class="text-right"
			@click="setSidebarVisible(!getSidebarVisible)"
		>{{ getSidebarVisible }}</h1>-->
		<b-sidebar
			v-model="getSidebarVisible"
			bg-variant="white"
			header-class="p-0"
			shadow="sm"
			sidebar-class="border-right"
			@change="setSidebarVisible"
		>
			<template #header="{ hide }">
				<b-navbar
					type="light"
					class="border-bottom shadow-sm w-100"
				>
					<b-navbar-brand
						role="button"
						@click="goBackRoute"
					>
						<strong>Partimap</strong>
						Admin
					</b-navbar-brand>
					<b-navbar-nav class="ml-auto">
						<b-nav-item @click="hide">
							<i class="fas fa-fw fa-times" />
						</b-nav-item>
					</b-navbar-nav>
				</b-navbar>
			</template>
			<template #default>
				<div class="p-3">
					<b-form-group>
						<b-form-input
							v-model="mapData.title"
							size="lg"
						/>
					</b-form-group>
				</div>
			</template>
			<template #footer>
				<div class="d-flex border-top align-items-center p-3">
					<b-button
						variant="outline-secondary"
						@click="goBackRoute"
					>
						<i class="fas fa-fw fa-chevron-left mr-1" />
						Térképek
					</b-button>
					<b-button
						class="ml-auto"
						:disabled="!contentModified"
						variant="success"
						@click="saveMap"
					>
						<i class="fas fa-fw fa-save mr-1" />
						Mentés
					</b-button>
				</div>
			</template>
		</b-sidebar>
	</div>
</template>

<script>
import GeoJSON from 'ol/format/GeoJSON';
import { mapGetters, mapMutations } from 'vuex';

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
			contentModified: false,
		};
	},
	head() {
		return {
			title: this.mapData.title,
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
	methods: {
		...mapMutations(['setSidebarVisible']),
		featuresFromRaw(featuresRaw) {
			// TODO this function was copied from Sheet.vue, would be nicer to centralize it...
			const features = JSON.parse(featuresRaw);
			const featureCollection = { type: 'FeatureCollection', features };
			return features ? new GeoJSON().readFeatures(featureCollection) : null;
		},
		loadInitFeatures() {
			return this.featuresFromRaw(this.initMapData.features);
		},
		async saveMap() {
			// to DB
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
			this.$bvModal
				.msgBoxConfirm(
					'Önnek nem mentett módosításai vannak. Kívánja őket menteni?',
					{
						title: 'Visszalépés',
						size: 'sm',
						buttonSize: 'sm',
						okVariant: 'danger',
						okTitle: 'Igen',
						cancelTitle: 'Nem',
						footerClass: 'p-2',
						hideHeaderClose: false,
						centered: true,
						autoFocusButton: 'ok',
					}
				)
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
	},
};
</script>
