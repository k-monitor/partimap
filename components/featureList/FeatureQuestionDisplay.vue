<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';

const feature = inject<GeoJsonFeature>('feature');
const interactions = inject<Ref<Interactions | null>>('interactions', ref(null));

const question = computed(() => {
	const dt = feature?.geometry?.type || '';
	const q = interactions?.value?.featureQuestions[dt];
	return q?.label ? q : null;
});

const answer = ref(safeParseJSONArray(feature?.properties?.partimapFeatureQuestion_ans));
watch(answer, (newAnswer) => {
	if (!feature || !question.value) return;
	feature.properties = feature.properties || {};
	feature.properties.partimapFeatureQuestion = question.value!.label;
	feature.properties.partimapFeatureQuestion_ans = JSON.stringify(newAnswer);
});
</script>

<template>
	<form-group
		v-if="question"
		:label="question.label"
	>
		<CheckboxGroup
			v-model="answer"
			:q="question"
		/>
	</form-group>
</template>
