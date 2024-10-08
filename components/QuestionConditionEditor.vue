<script setup lang="ts">
import type { Condition, Question } from '~/server/data/surveyAnswers';
import type { TestableQuestionOption } from './ShowIfEditor.vue';

const value = defineModel<Condition>({
	default: [[NaN], ''],
});

const props = defineProps<{
	testableQuestions: Question[];
	testableQuestionOptions: TestableQuestionOption[];
}>();

const answer = ref<string | null>(null);
const max = ref<number | null>(null);
const min = ref<number | null>(null);
const questionId = ref<[number, string?]>([NaN]);

const question = computed(() => {
	const q = props.testableQuestions.find(
		(q) => String(q.id) === String((questionId.value || [])[0]),
	);
	if (q) {
		if (q.type === 'rating') {
			q.min = 1;
			q.max = 5;
		} else {
			q.min = q.min || 0;
			q.max = q.max || 100;
		}
	}
	return q;
});

const hasOptions = computed(
	() =>
		!!question.value?.type &&
		'checkbox|dropdown|radiogroup|singleChoiceMatrix|multipleChoiceMatrix'.includes(
			question.value.type,
		),
); // different from the one in SurveyEditor

const isNumberQuestion = computed(
	() =>
		!!question.value?.type &&
		'distributeUnits|number|range|rating'.includes(question.value.type),
);

const minMax = computed(() => {
	if (!question.value?.type) return '';
	if (!isNumberQuestion.value) return '';
	if (question.value.type === 'rating') return '(1-5)';
	const hasMin = typeof question.value.min !== 'undefined';
	const hasMax = typeof question.value.max !== 'undefined';
	return hasMin && hasMax ? `(${question.value.min}-${question.value.max})` : '';
});

const answerOptions = computed(() => {
	if (!question.value) return [];
	return (
		(question.value.type.includes('Matrix')
			? question.value.columns
			: question.value.options) || []
	);
});

const serializedAnswer = computed(() => {
	if (isNumberQuestion.value) {
		if (Number.isInteger(min.value) && Number.isInteger(max.value)) {
			return `${min.value}-${max.value}`;
		} else {
			return null;
		}
	}
	return answer.value;
});

function deserializeCondition() {
	// [['questionId'], 'min-max']
	// [['questionId'], 'option']
	// [['matrixQuestionId', 'matrixRow'], 'option']
	if (!Array.isArray(value.value)) return [];
	const [qid, ans] = value.value;
	questionId.value = qid;
	if (ans?.match(/^\d+-\d+/)) {
		const nums = ans.split('-').map((p) => Number(p));
		min.value = nums[0];
		max.value = nums[1];
	} else {
		answer.value = ans;
	}
}
watchEffect(() => deserializeCondition()); // runs on mount and when value changes

function serializeCondition(): Condition {
	return [questionId.value, serializedAnswer.value || ''];
}
const condition = computed(() => serializeCondition());
watch(condition, (nc, oc) => {
	const ncj = JSON.stringify(nc);
	const ocj = JSON.stringify(oc);
	if (ncj !== ocj) value.value = nc; // emitting value
});

function fixMinMaxValues() {
	const arr = [min.value, max.value]
		.map((v) => v || 0)
		.map((v) => Math.max(v, question.value?.min || 0))
		.map((v) => Math.min(v, question.value?.max || 100));
	if (arr[0] > arr[1]) arr.reverse();
	min.value = arr[0];
	max.value = arr[1];
}
watch(question, async () => {
	await nextTick();
	min.value = question.value?.min || 0;
	max.value = question.value?.max || 100;
});
</script>

<template>
	<div>
		<b-form-group :label="$t('QuestionConditionEditor.selectQuestion')">
			<b-form-select
				v-model="questionId"
				:options="testableQuestionOptions"
				required
			/>
		</b-form-group>
		<b-form-group :label="$t('QuestionConditionEditor.selectAnswer') + ` ${minMax}`">
			<b-form-select
				v-if="!questionId"
				disabled
			/>
			<b-form-select
				v-else-if="hasOptions"
				v-model="answer"
				:options="answerOptions"
				required
			/>
			<div
				v-else-if="isNumberQuestion"
				class="d-flex"
			>
				<b-form-input
					v-model.number="min"
					:max="question?.max"
					:min="question?.min"
					required
					type="number"
					@blur="fixMinMaxValues"
				/>
				<label class="mx-2 col-form-label">-</label>
				<b-form-input
					v-model.number="max"
					:max="question?.max"
					:min="question?.min"
					required
					type="number"
					@blur="fixMinMaxValues"
				/>
			</div>
		</b-form-group>
	</div>
</template>
