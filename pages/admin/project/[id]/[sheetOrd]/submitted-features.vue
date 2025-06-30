<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';
import type { Project } from '~/server/data/projects';

const localePath = useLocalePath();

const route = useRoute();
const { id, sheetOrd } = route.params;

const { data: project } = await useFetch<Project>(`/api/project/${id}`);
const sheet = computed(() => project.value?.sheets?.[Number(sheetOrd)]); // sheets are ordered on server
const endpoint = computed(() => `/api/sheet/${sheet.value?.id}/submitted-features`);
const { data: _features } = await useFetch<GeoJsonFeature[]>(endpoint);

const features = ref(
	(_features.value || []).map((f) => {
		f.properties = f.properties || {};
		f.properties.extraStroke = DEFAULT_EXTRA_STROKE_FOR_VISITORS;
		return f;
	}),
);

useHead({
	title: () => `Admin: ${sheet.value?.title}`,
});

function back() {
	navigateTo(localePath(`/admin/project/${project.value?.id}`));
}
</script>

<template>
	<div class="d-flex h-100 position-relative">
		<Sidebar
			admin
			:back-label="$t('sheetEditor.back')"
			@back="back"
		>
			<h1 class="h3 mb-4">{{ sheet?.title }}</h1>
			<FeatureList
				v-model="features"
				:filename="sheet?.title"
				is-on-submitted-view
			/>
		</Sidebar>
		<div class="flex-grow-1">
			<Map
				:key="$route.path"
				:features="features"
				fit-selected
				:view-extent="safeParseJSON(sheet?.extent) || undefined"
			/>
		</div>
	</div>
</template>
