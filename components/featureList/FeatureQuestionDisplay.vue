<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';
import type { Question } from '~/server/data/surveyAnswers';

const feature = inject<GeoJsonFeature>('feature');
const interactions = inject<Ref<Interactions | null>>('interactions', ref(null));

const drawingInteraction = computed(() =>
	(interactions?.value?.drawing || []).find(
		(di) => di.id === feature?.properties?.visitorFeature,
	),
);

const question = computed(() => {
	const q = drawingInteraction.value?.featureQuestion;
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
			:q="question as Question"
		/>
	</form-group>
</template>
