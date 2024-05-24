<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';

const feature = inject<GeoJsonFeature>('feature');

const hidden = computed({
	get() {
		return feature?.properties?.hidden || false;
	},
	set(value) {
		if (value) {
			feature!.properties = feature!.properties || {};
			feature!.properties.hidden = true;
		} else if (feature?.properties) {
			delete feature.properties.hidden;
		}
	},
});
</script>

<template>
	<b-form-group>
		<b-form-checkbox
			v-model="hidden"
			name="hidden"
		>
			{{ $t('FeatureListElement.hidden') }}
		</b-form-checkbox>
	</b-form-group>
</template>
