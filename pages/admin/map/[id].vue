<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';
import type { Map } from '~/server/data/maps';

const localePath = useLocalePath();
const { currentRoute } = useRouter();
const { t } = useI18n();

const { data: mapData, refresh } = await useFetch<Map>('/api/map/' + currentRoute.value.params.id);

useHead({
	title: () => `Admin: ${mapData.value?.title}`,
});

function back() {
	navigateTo(localePath('/admin/maps'));
}

const title = ref(mapData.value?.title);
watch(title, () => (contentModified.value = true));

const contentModified = ref(false);

const features = ref(safeParseJSONArray(mapData.value?.features) as GeoJsonFeature[]);
const featuresJson = computed(() => JSON.stringify(features.value));
watch(featuresJson, () => (contentModified.value = true));

function handleFeatureDrawn(feature: GeoJsonFeature) {
	features.value.push(feature);
}

const { loading } = useStore();
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
		await nextTick();
		contentModified.value = false;
		successToast(t('mapEditor.success'));
	} catch (error) {
		errorToast(t('mapEditor.error'));
	} finally {
		loading.value = false;
	}
}
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

			<FeatureList
				v-model="features"
				:filename="title"
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
		</Sidebar>

		<div class="flex-grow-1">
			<Map
				:key="$route.path"
				:features="features"
				fit-selected
				@feature-drawn="handleFeatureDrawn"
			/>
			<EdgeDrawingButtons side="right" />
			<MapHint />
		</div>
	</div>
</template>
