<script setup lang="ts">
// import GeoJSON from 'ol/format/GeoJSON';

const { currentRoute } = useRouter();

// TODO ? store.commit('features/clear');
const { data: mapData, refresh } = await useFetch('/api/map/' + currentRoute.value.params.id);

useHead({
	title: `Admin: ${mapData.title}`,
});

const contentModified = ref(false);
const loading = ref(true);

onMounted(() => {
	// TOOD ? this.$store.commit('selected/clear');
	loading.value = false;
});

/*
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
		this.$nuxt.$on('toggleLoading', (value) => (this.loading = value));
	},
	beforeUnmount() {
		this.$nuxt.$off('contentModified');
		this.$nuxt.$off('toggleLoading');
	},
*/

/*
function back() {
	navigateTo(localePath('/admin/maps'));
}

function featuresFromRaw(featuresRaw) {
	// TODO this function was copied from Sheet.vue, would be nicer to centralize it...
	const features = JSON.parse(featuresRaw);
	const featureCollection = { type: 'FeatureCollection', features };
	return features ? new GeoJSON().readFeatures(featureCollection) : null;
}

function loadFeaturesFromStore() {
	const features = [];
	for (const f of this.getAllFeature) {
		const featureStr = new GeoJSON().writeFeature(f);
		features.push(JSON.parse(featureStr));
	}
	this.mapData.features = JSON.stringify(features);
}

function loadInitFeatures() {
	return this.featuresFromRaw(this.mapData.features);
}

async function save() {
	this.loading = true;
	this.loadFeaturesFromStore();
	try {
		this.mapData = await this.$axios.$patch('/api/map', this.mapData);
		this.contentModified = false;
		this.success(this.$t('mapEditor.success'));
	} catch (error) {
		this.errorToast(this.$t('mapEditor.error'));
	}
	this.loading = false;
}
*/
</script>

<template>
	<div class="d-flex h-100">
		<div
			class="bg-secondary"
			style="width: 40%; margin-left: -40%; transition: margin 0.2s ease"
		>
			Sidebar content
		</div>
		<div class="bg-primary flex-grow-1">Map content</div>

		<!-- <client-only>
			<Map
				:key="$route.path"
				:features="loadInitFeatures()"
				fit-selected
			/>
		</client-only>
		<MapToolbar />
		<MapHint />
		<Sidebar
			admin
			:back-label="$t('mapEditor.back')"
			:loading="loading"
			@back="back"
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
			<FeatureList
				:filename="mapData.title"
				is-on-editor-view
			/>

			<template #footer>
				<div class="p-2 text-center">
					<SaveButton
						:content-modified="contentModified"
						@save="save"
					/>
				</div>
			</template>
		</Sidebar> -->
	</div>
</template>
