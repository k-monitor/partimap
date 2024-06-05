<script setup lang="ts">
import type { Question } from '~/server/data/surveyAnswers';

defineProps<{
	question: Question;
}>();

const value = defineModel<Record<string, string | string[] | null>>({ default: {} });

function handleUpdate(row: string, answer: string | string[] | null) {
	const values = { ...value.value };
	values[row] = answer;
	value.value = values;
}
</script>

<template>
	<div class="overflow-auto">
		<div class="matrix d-table small w-100">
			<div class="d-table-row">
				<div class="d-table-cell">&nbsp;</div>
				<div
					v-for="column in question.columns"
					:key="column"
					class="d-table-cell align-middle p-1 text-center"
				>
					{{ column }}
				</div>
			</div>
			<MatrixRow
				v-for="row in question.rows"
				:key="row"
				:model-value="value[row]"
				:question="question"
				:row="row"
				@update:model-value="handleUpdate(row, $event)"
			/>
		</div>
	</div>
</template>

<style>
.border-collapse {
	border-collapse: collapse;
}
/*
.matrix .matrix-cell {
	flex: 1 1 auto;
	max-width: 90px;
	min-width: 68px;
}

.matrix .matrix-cell:first-of-type {
	max-width: unset;
	min-width: 90px;
}*/
</style>
