<script setup lang="ts">
import type { Sheet } from '~/server/data/sheets';
import type { Condition, Survey } from '~/server/data/surveyAnswers';

export type TestableQuestionOption = {
	label?: string;
	options?: { value: (string | number)[]; text: string }[];
	qid: number;
	text?: string;
	type: string;
	value?: (string | number)[];
};

const showIf = defineModel<Condition[]>({ default: [] });

const props = defineProps<{
	questionIndex: number; // limits range of testable questions within current survey
	sheetOrd: number; // defines previous sheets
	sheets: Sheet[];
	survey: Survey;
}>();

const questionsFromPrevSheets = computed(() => {
	return (props.sheets || [])
		.filter((s) => s.ord < props.sheetOrd && s.survey)
		.map((s) => parseSurvey(s.survey)?.questions || [])
		.flat();
});

const testableQuestions = computed(() =>
	[
		...questionsFromPrevSheets.value,
		...props.survey.questions.slice(0, props.questionIndex),
	].filter((q) => !isQuestionConditional(q) && q.type !== 'text'),
);

const isConditional = ref(false);
onMounted(() => {
	const validConds = showIf.value.filter((c) => c?.length === 2);
	isConditional.value = !!validConds.length;
});

function toggleConditional() {
	if (isConditional.value) {
		addNewCondition();
	} else {
		showIf.value = [];
	}
}

const canAddNewCondition = computed(() => {
	const condN = showIf.value[0]?.length || 0;
	return isConditional.value && condN === 2 && questionOptionsForCond(condN).length;
});

function addNewCondition() {
	const newCondition: Condition = [[NaN], ''];
	showIf.value = [...showIf.value, newCondition];
}

function clampText(t: string) {
	t = t || '';
	const limit = 26;
	return t.length > limit ? `${t.substring(0, limit)}...` : t;
}

const testableQuestionOptions = computed<TestableQuestionOption[]>(() =>
	testableQuestions.value.map((q) => {
		if (q.type.includes('Matrix') || q.type === 'distributeUnits') {
			return {
				label: clampText(q.label),
				options: (q.rows || q.options || []).map((r) => ({
					value: [q.id, r],
					text: clampText(r),
				})),
				qid: q.id,
				type: q.type,
			};
		} else {
			return {
				value: [q.id],
				text: clampText(q.label),
				qid: q.id,
				type: q.type,
			};
		}
	}),
);

function questionOptionsForCond(i: number) {
	if (!showIf.value || i == 0) return testableQuestionOptions.value;

	const referencedIds: Record<number, string[]> = {}; // { questionId: [row, row], ... }
	showIf.value.slice(0, i).forEach((c) => {
		if (!c[0]) return;
		const qid = c[0][0];
		const row = c[0][1];
		if (!qid) return;
		referencedIds[qid] = referencedIds[qid] || [];
		if (row) referencedIds[qid].push(row);
	});

	const options: TestableQuestionOption[] = [];
	testableQuestionOptions.value.forEach((o) => {
		const oneCondQuestionTypes = 'dropdown|number|radiogroup|range|rating|singleChoiceMatrix';

		if (!oneCondQuestionTypes.includes(o.type) || !referencedIds[o.qid]) {
			// question can be referenced multiple times
			// or hasn't been referenced -> available
			return options.push(o);
		}

		if (o.type === 'singleChoiceMatrix') {
			// matrix questions can be used
			// but their options has to be filtered
			const option: TestableQuestionOption = JSON.parse(JSON.stringify(o)); // copy
			option.options = (option.options || []).filter(
				(r) => !referencedIds[o.qid].includes(String(r.value[1])),
			);
			if (option.options.length) options.push(option);
		} else if (!referencedIds[o.qid]) {
			// other questions can be added if not referenced
			options.push(o);
		}
	});
	return options;
}

function handleConditionUpdated(i: number, c: Condition) {
	const conds = [...showIf.value];
	conds[i] = c;
	showIf.value = conds;
}

function deleteCondition(i: number) {
	if (showIf.value.length >= i) return;
	showIf.value.splice(i, 1);
	if (!showIf.value.length) {
		isConditional.value = false;
	}
}
</script>

<template>
	<div v-if="testableQuestions.length">
		<b-form-group>
			<b-form-checkbox
				v-model="isConditional"
				@change="toggleConditional"
			>
				{{ $t('SurveyEditor.showIf') }}
			</b-form-checkbox>
		</b-form-group>
		<div
			v-if="isConditional"
			class="ms-5"
		>
			<div
				v-for="(c, i) in showIf"
				:key="i"
			>
				<p v-if="i > 0">{{ $t('SurveyEditor.and') }}</p>
				<QuestionConditionEditor
					:testable-questions="testableQuestions"
					:testable-question-options="questionOptionsForCond(i)"
					:model-value="showIf[i]"
					@update:model-value="handleConditionUpdated(i, $event)"
				/>
				<p class="small text-end">
					<a
						href="javascript:void(0)"
						@click="deleteCondition(i)"
					>
						{{ $t('SurveyEditor.deleteCondition') }}
					</a>
				</p>
			</div>
			<b-button
				v-if="canAddNewCondition"
				variant="outline-success"
				@click="addNewCondition"
			>
				{{ $t('SurveyEditor.addCondition') }}
			</b-button>
		</div>
	</div>
</template>
