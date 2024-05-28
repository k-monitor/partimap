<script setup lang="ts">
import type { Question } from '~/server/data/surveyAnswers';

const value = defineModel<string | string[] | null>({ default: null });

const props = defineProps<{
	question: Question;
	row: string;
}>();

const checkSelected = ref<string[]>([]);
const radioSelected = ref<string | null>(null);

watchEffect(() => {
	const v = value.value;
	if (props.question.type === 'singleChoiceMatrix') {
		radioSelected.value = v as string | null;
	} else {
		checkSelected.value = (v as string[] | null) || [];
	}
});

watch(checkSelected, () => (value.value = checkSelected.value));
watch(radioSelected, () => (value.value = radioSelected.value));
</script>

<template>
	<div class="d-table-row">
		<div class="d-table-cell align-middle border-top p-1 position-relative">
			{{ row }}
			<input
				v-if="
					question.type === 'multipleChoiceMatrix' &&
					question.required &&
					(value || []).length < 1
				"
				:oninvalid="`this.setCustomValidity('${$t('CheckboxGroup.required')}')`"
				required
				type="checkbox"
				style="bottom: 0; opacity: 0; position: absolute; right: 0"
			/>
		</div>
		<div
			v-for="column in question.columns"
			:key="column"
			class="d-table-cell align-middle border-top py-3 text-center"
		>
			<div v-if="question.type === 'singleChoiceMatrix'">
				<b-form-radio
					v-model="radioSelected"
					:name="`${question.id}/${row}`"
					:required="question.required"
					:value="column"
				/>
			</div>
			<div v-if="question.type === 'multipleChoiceMatrix'">
				<b-form-checkbox
					v-model="checkSelected"
					:name="`${question.id}/${row}`"
					:value="column"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped>
.form-check {
	display: flex;
	justify-content: center;
}

.d-table-row:hover .d-table-cell {
	background-color: #e9ecef;
}

.d-table-cell {
	min-width: 60px;
}
</style>
