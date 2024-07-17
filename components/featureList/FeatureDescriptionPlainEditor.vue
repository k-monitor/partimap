<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';
import type { Sheet } from '~/server/data/sheets';

const feature = inject<GeoJsonFeature>('feature');
const interactions = inject<Ref<Interactions | null>>('interactions', ref(null));
const sheet = inject<Ref<Sheet | null>>('sheet', ref(null));

const { t } = useI18n();

const drawingInteraction = computed(() => lookupDrawingInteraction(interactions?.value, feature));

const label = computed(
	() =>
		drawingInteraction.value?.descriptionLabel ||
		sheet?.value?.descriptionLabel ||
		t('sheetEditor.defaultDescriptionLabel'),
);

const description = ref<string>(feature?.properties?.description || '');
watch(description, (newDescription) => {
	if (!feature) return;
	feature.properties = feature.properties || {};
	feature.properties.description = newDescription;
});
</script>

<template>
	<form-group :label="label">
		<textarea
			v-model="description"
			class="form-control form-control-sm"
		/>
	</form-group>
</template>
