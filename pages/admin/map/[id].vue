<script setup lang="ts">
import type { Map } from '~/server/data/maps';
// import GeoJSON from 'ol/format/GeoJSON';

const localePath = useLocalePath();
const { currentRoute } = useRouter();
const { t } = useI18n();

// FIXME ? store.commit('features/clear');
const { data: mapData, refresh } = await useFetch<Map>('/api/map/' + currentRoute.value.params.id);

useHead({
	title: () => `Admin: ${mapData.value?.title}`,
});

const contentModified = ref(false);
const loading = ref(true);

onMounted(() => {
	// FIXME ? this.$store.commit('selected/clear');
	loading.value = false;
});

function back() {
	navigateTo(localePath('/admin/maps'));
}

const title = ref(mapData.value?.title);
watch(title, () => (contentModified.value = true));

const { errorToast, successToast } = useToasts();
async function save() {
	try {
		loading.value = true;
		// FIXME this.loadFeaturesFromStore();
		await $fetch(`/api/map/${mapData.value?.id}`, {
			method: 'PATCH',
			body: {
				// FIXME add features
				title: title.value,
			},
		});
		await refresh();
		contentModified.value = false;
		successToast(t('mapEditor.success'));
	} catch (error) {
		errorToast(t('mapEditor.error'));
	} finally {
		loading.value = false;
	}
}

/*
	FIXME
	computed: {
		...mapGetters('features', ['getAllFeature']),
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
*/
</script>

<template>
	<div class="d-flex h-100 position-relative">
		<Sidebar
			v-if="mapData"
			admin
			:back-label="$t('mapEditor.back')"
			:loading="loading"
			@back="back"
		>
			<form-group
				class="mb-4"
				:label="$t('mapEditor.name')"
			>
				<input
					v-model="title"
					class="form-control form-control-lg"
				/>
			</form-group>

			<!-- FIXME <FeatureList
				:filename="mapData.title"
				is-on-editor-view
			/> -->

			<template #footer>
				<div class="p-2 text-center">
					<SaveButton
						:content-modified="contentModified"
						@save="save"
					/>
				</div>
			</template>
		</Sidebar>

		<div class="bg-light flex-grow-1">
			<!-- FIXME <client-only>
				<Map
					:key="$route.path"
					:features="loadInitFeatures()"
					fit-selected
				/>
				<MapToolbar />
				<MapHint />
			</client-only> -->
		</div>
	</div>
</template>
