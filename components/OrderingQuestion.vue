<script setup lang="ts">
import { VueDraggableNext as draggable } from 'vue-draggable-next';
import type { Question } from '~/server/data/surveyAnswers';

const value = defineModel<string[] | undefined>({ default: () => undefined });

const { question } = defineProps<{
	question: Question;
}>();

const shuffledOptions = computed(() => {
	const opts = question.options || [];
	return question.shuffleOptions ? shuffle(opts) : opts;
});

const draggableModel = computed({
	get() {
		return value.value && value.value?.length
			? value.value
			: [...(shuffledOptions.value || [])];
	},
	set(newOrder: string[]) {
		value.value = [...newOrder];
	},
});
</script>

<template>
	<b-list-group class="mb-3">
		<draggable
			v-model="draggableModel"
			animation="200"
			draggable=".item"
		>
			<b-list-group-item
				v-for="o in draggableModel"
				:key="o"
				button
				class="item"
			>
				{{ o }}
			</b-list-group-item>
		</draggable>
	</b-list-group>
</template>
