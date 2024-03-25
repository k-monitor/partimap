<script setup lang="ts">
import type { Feature } from 'geojson';
import type { Map } from '~/server/data/maps';

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

function parseFeatures() {
	try {
		return JSON.parse(mapData.value?.features || '[]') as Feature[];
	} catch {
		return [];
	}
}

const features = ref<Feature[]>(parseFeatures());
// watch(mapData, () => (features.value = parseFeatures()));
// watch(features, () => (contentModified.value = true));

const { errorToast, successToast } = useToasts();
async function save() {
	try {
		loading.value = true;
		await $fetch(`/api/map/${mapData.value?.id}`, {
			method: 'PATCH',
			body: {
				features: JSON.stringify(features.value),
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

			<!-- {{ JSON.stringify(features) }} -->

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

		<div class="flex-grow-1">
			<client-only>
				<Map
					:key="$route.path"
					:features="features"
					fit-selected
				/>
				<!-- FIXME
					<MapToolbar />
					<MapHint />
			 	-->
			</client-only>
		</div>
	</div>
</template>
