<script setup lang="ts">
import type { Question } from '~/server/data/surveyAnswers';

const value = defineModel<number | null>({ default: null });

defineProps<{
	question: Question;
}>();

function handleUpdate(rating: number) {
	if (!rating) value.value = null;
}
</script>

<template>
	<div class="position-relative">
		<div class="border d-flex fw-bold justify-content-center p-2">
			<VueStarRating
				v-model:rating="value"
				active-color="var(--brand)"
				animate
				border-color="var(--brand)"
				:border-width="2"
				clearable
				inactive-color="#fff"
				:max-rating="5"
				:star-size="20"
				:show-rating="false"
				@update:rating="handleUpdate"
			/>
		</div>
		<input
			v-if="question.required"
			v-model="value"
			class="position-absolute"
			required
			style="bottom: 0; left: 0; height: 0; opacity: 0"
		/>
	</div>
</template>
