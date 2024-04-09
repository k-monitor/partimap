<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';

const feature = inject<GeoJsonFeature>('feature');

const answer = computed(() =>
	safeParseJSONArray(feature?.properties?.partimapFeatureQuestion_ans).join(', '),
);
</script>

<template>
	<dl
		v-if="feature?.properties"
		class="mb-0"
	>
		<template v-if="answer">
			<dt>{{ feature.properties.partimapFeatureQuestion }}</dt>
			<dd class="mb-3">{{ answer }}</dd>
		</template>

		<template v-if="feature.properties.name">
			<dt>{{ $t('FeatureListElement.name') }}</dt>
			<dd class="mb-3">{{ feature.properties.name }}</dd>
		</template>

		<dt>{{ $t('FeatureListElement.description') }}</dt>
		<dd>{{ feature.properties.description }}</dd>
	</dl>
</template>
