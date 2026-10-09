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

const options = computed(() =>
	shuffledOptions.value.map((o) => {
		const label = optionLabel(o);
		return {
			text: label,
			value: label,
			image: typeof o === 'object' && o.image ? o.image : undefined,
		};
	}),
);
</script>

<template>
	<b-form-radio-group
		v-model="value"
		:name="`q${q.id}`"
		:options="options"
		:required="q.required"
		stacked
	/>
</template>
