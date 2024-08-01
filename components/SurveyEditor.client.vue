<script setup lang="ts">
// TODO spaghetti, need to decouple into multiple components/composables

import type { BvTriggerableEvent } from 'bootstrap-vue-next';
import type { Project } from '~/server/data/projects';
import type { Sheet } from '~/server/data/sheets';
import type { Question, Survey } from '~/server/data/surveyAnswers';

const { t } = useI18n();

const project = inject<Ref<Project | null>>('project');
const sheet = inject<Ref<Sheet | null>>('sheet');

const surveyJSON = defineModel<string>();

const props = defineProps<{
	readonly?: boolean;
}>();

const survey = ref<Survey>({ questions: [] as Question[] });

watchEffect(() => {
	// when survey JSON changes, update survey model
	survey.value = parseSurvey(surveyJSON.value) || survey.value;
});

const icon: Record<string, string> = {
	text: 'fa-keyboard',
	number: 'fa-hashtag',
	range: 'fa-sliders-h',
	checkbox: 'fa-check-square',
	radiogroup: 'fa-dot-circle',
	dropdown: 'fa-caret-square-down',
	rating: 'fa-star-half-alt',
	singleChoiceMatrix: 'fa-dot-circle',
	multipleChoiceMatrix: 'fa-check-square',
	distributeUnits: 'fa-balance-scale',
};

const questionTypes = [
	{
		value: 'text',
		text: t('SurveyEditor.questionTypes.text'),
	},
	{
		value: 'number',
		text: t('SurveyEditor.questionTypes.number'),
	},
	{
		value: 'range',
		text: t('SurveyEditor.questionTypes.range'),
	},
	{
		value: 'checkbox',
		text: t('SurveyEditor.questionTypes.checkbox'),
	},
	{
		value: 'radiogroup',
		text: t('SurveyEditor.questionTypes.radiogroup'),
	},
	{
		value: 'dropdown',
		text: t('SurveyEditor.questionTypes.dropdown'),
	},
	{
		value: 'rating',
		text: t('SurveyEditor.questionTypes.rating'),
	},
	{
		value: 'singleChoiceMatrix',
		text: t('SurveyEditor.questionTypes.singleChoiceMatrix'),
	},
	{
		value: 'multipleChoiceMatrix',
		text: t('SurveyEditor.questionTypes.multipleChoiceMatrix'),
	},
	{
		value: 'distributeUnits',
		text: t('SurveyEditor.questionTypes.distributeUnits'),
	},
];

const cancelledDrag = ref<number[]>([]);
const question = ref<Question | null>(null);
const questionIndex = ref(0);

const hasOptions = computed(
	() =>
		question.value?.type &&
		'checkbox|distributeUnits|dropdown|radiogroup'.includes(question.value.type),
);

const questionsFromNextSheets = computed(() => {
	if (!sheet?.value) return [];
	return (project?.value?.sheets || [])
		.filter((s) => s.ord > sheet.value!.ord)
		.map((s) => {
			const questions = parseSurvey(s.survey)?.questions || [];
			const dis = deserializeInteractions(s).drawing;
			return [...questions, ...dis];
		})
		.flat();
});

const questionEditorVisible = ref(false);
function editQuestion(i: number) {
	questionIndex.value = i;
	question.value = { ...survey.value.questions[i] };
	questionEditorVisible.value = true;
}

const emit = defineEmits<{
	(e: 'modified'): void;
}>();

async function emitSurvey() {
	cancelledDrag.value.splice(0, cancelledDrag.value.length);
	if (props.readonly) return true;
	surveyJSON.value = JSON.stringify(survey.value);
	await nextTick();
	emit('modified');
}

function addQuestion() {
	const id = new Date().getTime();
	const label = t('SurveyEditor.questionPrefix') + ` #${survey.value.questions.length + 1}`;
	const q: Question = {
		id,
		label,
		type: 'text',
		showResult: false,
	};
	survey.value.questions.push(q);
	emitSurvey();
	editQuestion(survey.value.questions.length - 1);
}

function canHaveResults(q: Question) {
	return q.type && q.type !== 'text';
}

const { confirmDeletion } = useConfirmation();

async function delQuestion(i: number) {
	const confirmed = await confirmDeletion(survey.value.questions[i].label);
	if (confirmed) {
		survey.value.questions.splice(i, 1);
		emitSurvey();
	}
}

const form = ref<HTMLFormElement>();
function saveQuestion(bvModalEvent: BvTriggerableEvent | Event) {
	if (!question.value) return;

	if (!form.value?.reportValidity()) {
		bvModalEvent.preventDefault();
		return;
	}

	questionEditorVisible.value = false;
	if (!hasOptions.value) {
		const q: Question = { ...question.value };
		delete q.options;
		question.value = q;
	}
	if (Array.isArray(question.value?.showIf)) {
		question.value.showIf = question.value.showIf.filter((c) => c?.length === 2);
	}
	survey.value.questions[questionIndex.value] = question.value;
	emitSurvey();
}

function inputValid(max: number) {
	if (!question.value) return;
	if (!question.value.options || !max || max < 1 || max >= question.value.options.length) {
		question.value.max = undefined;
	}
}

function referencedQuestionIdsOf(question: Question | DrawingInteraction) {
	return Array.isArray(question?.showIf) ? question.showIf.map((c) => c[0][0]) : [];
}

function questionIdsThatReference(question: Question) {
	return [...survey.value.questions, ...questionsFromNextSheets.value]
		.filter((q) => {
			const refIds = referencedQuestionIdsOf(q);
			return refIds.includes(question?.id);
		})
		.map((q) => q.id);
}

function indexOfQuestionId(id: number) {
	return survey.value.questions.findIndex((q) => q.id === id);
}

function isQuestionReferenced(question: Question) {
	return questionIdsThatReference(question).length;
}

function canMoveQuestion(e: { draggedContext: { index: number; futureIndex: number } }) {
	const { index, futureIndex } = e.draggedContext;
	const question = survey.value.questions[index];

	// conditional questions cannot be moved above
	// their referenced questions
	const refIds = referencedQuestionIdsOf(question);
	if (refIds.length) {
		const refInd = refIds.map(indexOfQuestionId);
		const minInd = Math.max(...refInd);
		if (futureIndex < minInd + 1) {
			cancelledDrag.value.splice(0, cancelledDrag.value.length);
			cancelledDrag.value.push(question.id, survey.value.questions[minInd].id);
			return false;
		}
	}

	// referenced questions cannot be moved below
	// those questions that reference them
	const conIds = questionIdsThatReference(question);
	if (conIds.length) {
		const conInd = conIds
			.map((id) => indexOfQuestionId(Number(id)))
			.filter((id) => !Number.isNaN(id));
		const maxInd = Math.min(...conInd);
		if (futureIndex > maxInd - 1) {
			cancelledDrag.value.splice(0, cancelledDrag.value.length);
			cancelledDrag.value.push(question.id, survey.value.questions[maxInd].id);
			return false;
		}
	}

	cancelledDrag.value.splice(0, cancelledDrag.value.length);
	return true;
}

const questionLabelInput = ref<HTMLInputElement>();
</script>

<template>
	<div>
		<b-list-group class="mb-3">
			<draggable
				v-model="survey.questions"
				:draggable="props.readonly ? null : '.item'"
				handle=".handle"
				:move="canMoveQuestion"
				@end="emitSurvey"
			>
				<b-list-group-item
					v-for="(q, i) in survey.questions"
					:key="q.id"
					button
					class="item p-0"
				>
					<div class="d-flex align-items-stretch">
						<div class="handle d-flex flex-shrink-0 align-items-center px-2 bg-light">
							<i class="fas fa-grip-vertical" />
						</div>
						<div
							class="flex-grow-1 overflow-hidden p-2"
							@click="editQuestion(i)"
						>
							<p class="fw-bold mb-1 text-truncate">
								<span v-if="q.required">*</span>
								{{ q.label }}
							</p>
							<div class="d-flex align-items-center text-muted">
								<i
									v-b-tooltip.hover.bottom
									class="fas fa-fw me-2"
									:class="icon[q.type]"
									:title="$t(`SurveyEditor.questionTypes.${q.type}`)"
								/>
								<i
									v-if="q.showResult && canHaveResults(q)"
									v-b-tooltip.hover.bottom
									class="fas fa-chart-bar fa-fw me-2"
									:title="$t('SurveyEditor.showResult')"
								/>
								<i
									v-if="isQuestionReferenced(q)"
									v-b-tooltip.hover.bottom
									class="fas fa-level-up-alt fa-rotate-270 fa-fw me-2"
									:class="
										cancelledDrag.includes(q.id)
											? 'alert-danger text-danger rounded'
											: ''
									"
									:title="$t('SurveyEditor.referencedQuestion')"
								/>
								<i
									v-if="isQuestionConditional(q)"
									v-b-tooltip.hover.bottom
									class="fas fa-level-up-alt fa-fw me-2"
									:class="
										cancelledDrag.includes(q.id)
											? 'alert-danger text-danger rounded'
											: ''
									"
									:title="$t('SurveyEditor.conditionalQuestion')"
								/>
								<b-button
									v-if="!props.readonly && !isQuestionReferenced(q)"
									v-b-tooltip.hover.bottom
									class="border-0 ms-auto text-danger"
									size="sm"
									:title="$t('SurveyEditor.deleteQuestion')"
									variant="light"
									@click.stop="delQuestion(i)"
								>
									<i class="fas fa-fw fa-trash" />
								</b-button>
							</div>
						</div>
					</div>
				</b-list-group-item>
				<b-list-group-item
					v-if="!props.readonly"
					button
					class="d-flex align-items-center text-success"
					@click="addQuestion"
				>
					<i class="fas fa-fw fa-plus me-2" />
					{{ $t('SurveyEditor.addQuestion') }}
				</b-list-group-item>
			</draggable>
		</b-list-group>
		<b-modal
			v-model="questionEditorVisible"
			:cancel-title="$t('modals.cancel')"
			:ok-disabled="props.readonly"
			:ok-title="$t('SaveButton.save')"
			ok-variant="success"
			:teleport-disabled="true"
			teleport-to="body"
			:title="$t('SurveyEditor.questionPrefix') + ` #${questionIndex + 1}`"
			@ok="saveQuestion"
			@shown="questionLabelInput?.focus()"
		>
			<form
				v-if="question"
				:key="question.type"
				ref="form"
				@submit.prevent="saveQuestion"
			>
				<!-- ^
					:key=q.type is needed because for some reason form group order
					can change sometimes when q.type is changed
				-->
				<div
					v-if="isQuestionReferenced(question)"
					class="alert alert-warning"
				>
					{{ $t('SurveyEditor.warnForReferencedQuestion') }}
				</div>
				<b-form-group :label="$t('SurveyEditor.questionText')">
					<b-form-input
						ref="questionLabelInput"
						v-model="question.label"
						:disabled="props.readonly"
						:readonly="props.readonly"
						required
					/>
				</b-form-group>
				<b-form-group :label="$t('SurveyEditor.questionType')">
					<b-form-select
						v-model="question.type"
						:disabled="!!(props.readonly || isQuestionReferenced(question))"
						:options="questionTypes"
					/>
				</b-form-group>
				<b-row v-if="'number|range'.includes(question.type)">
					<b-col>
						<b-form-group :label="$t('SurveyEditor.minValue')">
							<b-form-input
								v-model.number="question.min"
								:disabled="!!(props.readonly || isQuestionReferenced(question))"
								type="number"
							/>
						</b-form-group>
					</b-col>
					<b-col>
						<b-form-group :label="$t('SurveyEditor.maxValue')">
							<b-form-input
								v-model="question.max"
								:disabled="!!(props.readonly || isQuestionReferenced(question))"
								type="number"
							/>
						</b-form-group>
					</b-col>
				</b-row>
				<b-row v-if="question.type === 'range'">
					<b-col>
						<b-form-group :label="$t('SurveyEditor.minName')">
							<b-form-input v-model="question.minLabel" />
						</b-form-group>
					</b-col>
					<b-col>
						<b-form-group :label="$t('SurveyEditor.maxName')">
							<b-form-input v-model="question.maxLabel" />
						</b-form-group>
					</b-col>
				</b-row>
				<b-row v-if="question.type === 'checkbox'">
					<b-col>
						<b-form-group :label="$t('SurveyEditor.maxSelect')">
							<b-form-input
								v-model.number="question.max"
								type="number"
								min="1"
								:max="!question.options ? 0 : question.options.length"
								@change="inputValid"
							/>
						</b-form-group>
					</b-col>
				</b-row>
				<b-row v-if="question.type === 'distributeUnits'">
					<b-col>
						<b-form-group :label="$t('SurveyEditor.units')">
							<b-form-input
								v-model.number="question.max"
								type="number"
								min="1"
							/>
						</b-form-group>
					</b-col>
				</b-row>
				<OptionsEditor
					v-if="hasOptions"
					v-model="question.options"
					:readonly="!!(props.readonly || isQuestionReferenced(question))"
					label-state="option"
				/>
				<OptionsEditor
					v-if="'singleChoiceMatrix|multipleChoiceMatrix'.includes(question.type)"
					v-model="question.rows"
					:readonly="!!(props.readonly || isQuestionReferenced(question))"
					label-state="row"
				/>
				<OptionsEditor
					v-if="'singleChoiceMatrix|multipleChoiceMatrix'.includes(question.type)"
					v-model="question.columns"
					:readonly="!!(props.readonly || isQuestionReferenced(question))"
					label-state="column"
				/>
				<b-form-group v-if="'checkbox|dropdown'.includes(question.type)">
					<b-form-checkbox v-model="question.other">
						{{ $t('SurveyEditor.other') }}
					</b-form-checkbox>
				</b-form-group>
				<b-form-group>
					<b-form-checkbox v-model="question.required">
						{{ $t('SurveyEditor.required') }}
					</b-form-checkbox>
				</b-form-group>
				<b-form-group v-if="canHaveResults(question)">
					<b-form-checkbox v-model="question.showResult">
						{{ $t('SurveyEditor.showResult') }}
					</b-form-checkbox>
				</b-form-group>
				<b-form-group>
					<b-form-checkbox v-model="question.addToFeatures">
						{{ $t('SurveyEditor.addToFeatures') }}
					</b-form-checkbox>
				</b-form-group>

				<ShowIfEditor
					v-model="question.showIf"
					:question-index="questionIndex"
					:sheet-ord="sheet?.ord || 0"
					:survey="survey"
				/>
			</form>
		</b-modal>
	</div>
</template>
