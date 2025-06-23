<script setup lang="ts">
import type { Sheet } from '~/server/data/sheets';
import type { Question } from '~/server/data/surveyAnswers';

const props = defineProps<{
	question: Question;
	sheets: Sheet[];
	sheetOrd: number;
}>();

const emit = defineEmits<{
	(e: 'move', targetSheetId: number): void;
}>();

const targetSheets = computed(() => {
	const questionsDict: Record<string, number> = {}; // questionId -> sheet ord
	props.sheets.forEach((s) => {
		allQuestions(s).forEach((q) => {
			questionsDict[q.id] = s.ord;
		});
	});

	// lowest possible target sheet ord =
	// highest sheet ord that the current question references
	const minSheetOrd = referencedQuestionIdsOf(props.question)
		.map((qid) => questionsDict[qid])
		.reduce((maxOrd, ord) => Math.max(maxOrd, ord || maxOrd), -1);

	// highest possible target sheet ord =
	// lowest sheet ord that references the current question
	// MINUS 1 (because we move to the end of the question list of the target sheet)
	const maxSheetOrd =
		-1 +
		props.sheets
			.filter((s) => s.ord >= props.sheetOrd)
			.filter((s) => {
				const pr = (q: Question | DrawingInteraction) =>
					referencedQuestionIdsOf(q).includes(props.question.id);
				return allQuestions(s).some(pr);
			})
			.reduce((minOrd, s) => Math.min(minOrd, s.ord), Number.MAX_SAFE_INTEGER);

	return props.sheets.filter(
		(s) =>
			s.ord !== props.sheetOrd &&
			s.survey !== null &&
			s.ord >= minSheetOrd &&
			s.ord <= maxSheetOrd,
	);
});

const modalVisible = ref(false);
const targetSheetId = ref<number | null>(
	targetSheets.value.length ? targetSheets.value[0].id : null,
);

function handleMove() {
	if (targetSheetId.value !== null) {
		emit('move', targetSheetId.value);
	}
}
</script>

<template>
	<b-button
		v-if="targetSheets.length"
		v-b-tooltip.hover.bottom
		class="border-0"
		size="sm"
		:title="$t('SurveyEditor.moveQuestion')"
		variant="light"
		@click.stop="modalVisible = true"
	>
		<i class="fas fa-fw fa-left-right" />
	</b-button>
	<b-modal
		v-if="targetSheets.length"
		v-model="modalVisible"
		:cancel-title="$t('modals.cancel')"
		no-close-on-backdrop
		:ok-title="$t('SaveButton.save')"
		ok-variant="success"
		:title="$t('SurveyEditor.moveQuestion')"
		@ok="handleMove"
	>
		<select
			v-model="targetSheetId"
			class="form-select"
		>
			<option
				v-for="s in targetSheets"
				:key="s.id"
				:value="s.id"
			>
				{{ s.title }}
			</option>
		</select>
	</b-modal>
</template>
