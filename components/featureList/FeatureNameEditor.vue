<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';

const feature = inject<GeoJsonFeature>('feature');

const { t } = useI18n();

const defaultName =
	feature?.properties?.featureLabel ||
	t('FeatureListElement.defaultName.' + feature?.geometry?.type);
const name = ref(feature?.properties?.name);

watch(name, (newName) => {
	if (!feature) return;
	feature.properties = feature.properties || {};
	feature.properties.name = newName;
});
</script>

<template>
	<form-group :label="$t('FeatureListElement.name')">
		<b-form-input
			v-model="name"
			:placeholder="defaultName"
			size="sm"
			type="text"
		/>
	</form-group>
</template>
