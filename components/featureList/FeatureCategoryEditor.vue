<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';

const feature = inject<GeoJsonFeature>('feature');

defineProps<{
	categories: string[];
}>();
</script>

<template>
	<form-group
		v-if="feature && feature.properties"
		:label="$t('FeatureListElement.category')"
	>
		<Typeahead
			v-model="feature.properties.category"
			allow-new
			input-class="form-control form-control-sm"
			:items="categories"
			:min-input-length="0"
		/>
	</form-group>
</template>
