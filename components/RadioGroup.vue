<script setup lang="ts">
import type { Question } from '~/server/data/surveyAnswers';

const value = defineModel<string>({ default: '' });

const props = defineProps<{
	q: Question;
}>();

const shuffledOptions = computed(() => {
	const opts = props.q.options || [];
	return props.q.shuffleOptions ? shuffle(opts) : opts;
});
</script>

<template>
	<b-form-radio-group
		v-model="value"
		:name="`q${q.id}`"
		:options="shuffledOptions"
		:required="q.required"
		stacked
	/>
</template>
