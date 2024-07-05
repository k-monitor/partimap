<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';

const feature = inject<GeoJsonFeature>('feature');
</script>

<template>
	<form-group
		v-if="feature && feature.properties"
		class="rich"
		:label="$t('FeatureListElement.description')"
	>
		<tiptap v-model="feature.properties.description" />
	</form-group>
</template>
