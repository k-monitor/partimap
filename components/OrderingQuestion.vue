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

const { t } = useI18n();
</script>

<template>
	<b-list-group class="mb-3 position-relative">
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
		<input
			v-if="question.required && (value || []).length < 1"
			required
			tabindex="-1"
			type="checkbox"
			:oninvalid="`this.setCustomValidity('${t('OrderingQuestion.required')}')`"
			style="bottom: 0; height: 1px; opacity: 0; pointer-events: none; position: absolute"
		/>
	</b-list-group>
</template>
