<script setup lang="ts">
import type { Question, Survey } from '~/server/data/surveyAnswers';

const props = defineProps<{
	sheetId: number;
	surveyJson: string;
}>();

const { getAllVisitorAnswers, getVisitorAnswers, setVisitorAnswers } = useVisitorData();

const questions = computed(() => {
	const survey: Partial<Survey> = safeParseJSON(props.surveyJson) || {};
	return survey.questions || [];
});

const visibleQuestions = computed(() =>
	questions.value.filter((q) => canShowQuestion(q, getAllVisitorAnswers.value)),
);
watch(visibleQuestions, (vq) => {
	const visibleIds = vq.map((q) => String(q.id));
	const answeredIds = Object.keys(answers.value);
	const hiddenIds = answeredIds.filter((id) => !visibleIds.includes(String(id)));
	hiddenIds.forEach((id) => delete answers.value[id]);
});

const answers = ref<AnswersByQuestion>(getVisitorAnswers(props.sheetId));
watch(
	answers,
	(a) => {
		removeEmptyAnswers(a);
		setVisitorAnswers(props.sheetId, a);
	},
	{ deep: true },
);

function removeEmptyAnswers(answers: AnswersByQuestion) {
	Object.entries(answers || {})
		.filter(([, v]) => {
			if (v === null || v === undefined || v === '') return true;
			if (Array.isArray(v) && !v.length) return true;
			if (typeof v === 'object') {
				if (Object.keys(v).length === 0) return true;
				if (Object.values(v).every((x) => !x)) return true; // removes also if all values are 0
				if (Object.values(v).every((x) => Array.isArray(x) && !x.length)) return true;
			}
			return false;
		})
		.forEach(([k]) => delete answers[k]);
	return answers;
}

function canRemoveAnswer(q: Question) {
	return (
		Object.keys(answers.value).includes(String(q.id)) &&
		'distributeUnits|dropdown|radiogroup|range|rating|singleChoiceMatrix'.includes(q.type)
	);
}

function removeAnswer(questionId: number) {
	delete answers.value[questionId];
}
</script>

<template>
	<form-group
		v-for="q in visibleQuestions"
		:key="q.id"
		class="my-4"
	>
		<template #label>
			<div class="position-relative pr-5 mb-3">
				<div>
					<span
						v-if="q.required"
						class="text-danger"
					>
						*
					</span>
					<strong class="text-primary">{{ q.label }}</strong>
				</div>
				<b-button
					v-if="canRemoveAnswer(q)"
					v-b-tooltip.hover.bottom
					class="position-absolute ms-4 small text-muted text-end"
					size="sm"
					style="top: 0; right: 0"
					:title="$t('Survey.removeAnswer')"
					variant="light"
					@click="removeAnswer(q.id)"
				>
					<i class="fas fa-fw fa-eraser text-danger" />
				</b-button>
			</div>
		</template>
		<CheckboxGroup
			v-if="q.type == 'checkbox'"
			v-model="answers[q.id]"
			:q="q"
		/>
		<b-form-input
			v-else-if="q.type === 'text'"
			:id="`ssr-id-q${q.id}`"
			v-model.trim="answers[q.id]"
			:name="`q${q.id}`"
			:required="q.required"
		/>
		<template v-else-if="'number|range'.includes(q.type)">
			<div
				v-if="q.type === 'range' && q.minLabel && q.maxLabel"
				class="align-items-end d-flex justify-content-between small"
			>
				<span>{{ q.minLabel }}</span>
				<strong class="mx-2">{{ answers[q.id] }}</strong>
				<span class="text-end">{{ q.maxLabel }}</span>
			</div>
			<div class="align-items-center d-flex position-relative">
				<b-form-input
					:id="`ssr-id-q${q.id}`"
					v-model.number="answers[q.id]"
					:min="q.min"
					:max="q.max"
					:name="`q${q.id}`"
					:required="q.required"
					:type="q.type === 'number' ? 'number' : 'range'"
				/>
				<strong
					v-if="q.type == 'range' && (!q.minLabel || !q.maxLabel)"
					class="ms-2 text-end"
					style="min-width: 2rem"
					>{{ answers[q.id] }}</strong
				>
				<input
					v-if="q.type == 'range' && q.required"
					v-model="answers[q.id]"
					class="position-absolute"
					required
					style="bottom: 0; left: 50%; width: 50%; height: 0; opacity: 0"
				/>
			</div>
		</template>
		<client-only v-else-if="q.type === 'radiogroup'">
			<b-form-radio-group
				v-model="answers[q.id]"
				:name="`q${q.id}`"
				:options="q.options"
				:required="q.required"
				stacked
			/>
		</client-only>
		<DropdownGroup
			v-else-if="q.type === 'dropdown'"
			v-model="answers[q.id]"
			:q="q"
		/>
		<ChoiceMatrix
			v-else-if="q.type === 'singleChoiceMatrix' || q.type === 'multipleChoiceMatrix'"
			v-model="answers[q.id]"
			:question="q"
		/>
		<RatingQuestion
			v-else-if="q.type === 'rating'"
			v-model="answers[q.id]"
			:question="q"
		/>
		<DistributeUnitsQuestion
			v-else-if="q.type === 'distributeUnits'"
			:model-value="answers[q.id] || {}"
			:question="q"
			@update:model-value="answers[q.id] = $event"
		/>
	</form-group>
</template>
