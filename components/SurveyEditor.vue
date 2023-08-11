<template>
	<div>
		<b-list-group class="mb-3">
			<draggable
				v-model="survey.questions"
				:draggable="readonly ? null : '.item'"
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
						<div
							class="handle d-flex flex-shrink-0 align-items-center px-2 bg-light"
						>
							<i class="fas fa-grip-vertical" />
						</div>
						<div
							class="flex-grow-1 overflow-hidden p-2"
							@click="editQuestion(i)"
						>
							<p class="font-weight-bold mb-1 text-truncate">
								<span v-if="q.required">*</span>
								{{ q.label }}
							</p>
							<div class="d-flex align-items-center text-muted">
								<!-- FIXME tooltips i18n -->
								<i
									v-b-tooltip.hover.bottom
									class="fas fa-fw mr-2"
									:class="icon[q.type]"
									:title="
										$t(
											`SurveyEditor.questionTypes.${q.type}`
										)
									"
								/>
								<i
									v-if="q.showResult && canHaveResults(q)"
									v-b-tooltip.hover.bottom
									class="fas fa-chart-bar fa-fw mr-2"
									title="Eredmények megjelennek"
								/>
								<i
									v-if="isQuestionReferenced(q)"
									v-b-tooltip.hover.bottom
									class="fas fa-level-up-alt fa-rotate-270 fa-fw mr-2"
									title="Más kérdés függ ettől"
								/>
								<i
									v-if="isQuestionConditional(q)"
									v-b-tooltip.hover.bottom
									class="fas fa-level-up-alt fa-fw mr-2"
									title="Feltételesen jelenik meg"
								/>
								<b-button
									v-if="!readonly && !isQuestionReferenced(q)"
									v-b-tooltip.hover.bottom
									class="border-0 ml-auto text-danger"
									size="sm"
									title="Kérdés törlése"
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
					v-if="!readonly"
					slot="footer"
					button
					class="d-flex align-items-center text-success"
					@click="addQuestion"
				>
					<i class="fas fa-fw fa-plus mr-2" />
					{{ $t('SurveyEditor.addQuestion') }}
				</b-list-group-item>
			</draggable>
		</b-list-group>
		<b-modal
			id="survey-question-editor"
			:cancel-title="$t('modals.cancel')"
			:ok-disabled="readonly"
			:title="
				$t('SurveyEditor.questionPrefix') + ` #${questionIndex + 1}`
			"
			@ok="saveQuestion"
			@shown="$refs.questionLabelInput.focus()"
		>
			<div
				v-if="isQuestionReferenced(question)"
				class="alert alert-warning"
			>
				<!-- FIXME i18n -->
				Ettől a kérdéstől legalább egy másik kérdés megjelenítése függ,
				így bizonyos tulajdonságai nem módosíthatók.
			</div>
			<form
				ref="form"
				@submit.prevent="saveQuestion"
			>
				<b-form-group :label="$t('SurveyEditor.questionText')">
					<b-form-input
						ref="questionLabelInput"
						v-model="question.label"
						:disabled="readonly"
						:readonly="readonly"
						required
					/>
				</b-form-group>
				<b-form-group :label="$t('SurveyEditor.questionType')">
					<b-form-select
						v-model="question.type"
						:disabled="
							!!(readonly || isQuestionReferenced(question))
						"
						:options="questionTypes"
					/>
				</b-form-group>
				<b-row v-if="'number|range'.includes(question.type)">
					<b-col>
						<b-form-group :label="$t('SurveyEditor.minValue')">
							<b-form-input
								v-model="question.min"
								:disabled="
									!!(
										readonly ||
										isQuestionReferenced(question)
									)
								"
								type="number"
							/>
						</b-form-group>
					</b-col>
					<b-col>
						<b-form-group :label="$t('SurveyEditor.maxValue')">
							<b-form-input
								v-model="question.max"
								:disabled="
									!!(
										readonly ||
										isQuestionReferenced(question)
									)
								"
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
								:max="
									!question.options
										? 0
										: question.options.length
								"
								@change="inputValid"
							/>
						</b-form-group>
					</b-col>
				</b-row>
				<OptionsEditor
					v-if="hasOptions"
					v-model="question.options"
					:readonly="!!(readonly || isQuestionReferenced(question))"
					label-state="option"
				/>
				<OptionsEditor
					v-if="
						'singleChoiceMatrix|multipleChoiceMatrix'.includes(
							question.type
						)
					"
					v-model="question.rows"
					:readonly="!!(readonly || isQuestionReferenced(question))"
					label-state="row"
				/>
				<OptionsEditor
					v-if="
						'singleChoiceMatrix|multipleChoiceMatrix'.includes(
							question.type
						)
					"
					v-model="question.columns"
					:readonly="!!(readonly || isQuestionReferenced(question))"
					label-state="column"
				/>
				<b-form-group
					v-if="'checkbox|dropdown'.includes(question.type)"
				>
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

				<div v-if="testableQuestions.length">
					<!-- FIXME i18n -->
					<b-form-group>
						<b-form-checkbox
							v-model="questionIsConditional"
							@change="toggleConditional"
						>
							Megjelenik, ha...
						</b-form-checkbox>
					</b-form-group>
					<div
						v-if="questionIsConditional"
						class="ml-5"
					>
						<div v-if="Array.isArray(question.showIf)">
							<div
								v-for="(c, i) in question.showIf"
								:key="i"
							>
								<p v-if="i > 0">ÉS</p>
								<QuestionConditionEditor
									v-model="question.showIf[i]"
									:testable-questions="testableQuestions"
								/>
								<p class="small text-right">
									<a
										href="javascript:void(0)"
										@click="deleteCondition(i)"
										>Feltétel törlése</a
									>
								</p>
							</div>
							<b-button
								v-if="canAddNewCondition"
								variant="outline-success"
								@click="addNewCondition"
							>
								Új feltétel (ÉS)
							</b-button>
						</div>
					</div>
				</div>
			</form>
		</b-modal>
	</div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
	components: {
		draggable,
	},
	props: {
		value: {
			type: String, // survey definition as JSON string
			default: null,
		},
		project: {
			type: Object,
			default: null,
		},
		readonly: {
			type: Boolean,
			default: false,
		},
		sheet: {
			type: Object,
			default: null,
		},
	},
	data() {
		const survey = JSON.parse(this.value || '{}');
		if (!survey.questions) {
			survey.questions = [];
		}
		if (survey.showResults) {
			survey.questions.forEach(q => (q.showResult = true));
		}
		return {
			survey, // survey definition as parsed object
			icon: {
				text: 'fa-keyboard',
				number: 'fa-hashtag',
				range: 'fa-sliders-h',
				checkbox: 'fa-check-square',
				radiogroup: 'fa-dot-circle',
				dropdown: 'fa-caret-square-down',
				rating: 'fa-star-half-alt',
				singleChoiceMatrix: 'fa-dot-circle',
				multipleChoiceMatrix: 'fa-check-square',
			},
			questionTypes: [
				{
					value: 'text',
					text: this.$t('SurveyEditor.questionTypes.text'),
				},
				{
					value: 'number',
					text: this.$t('SurveyEditor.questionTypes.number'),
				},
				{
					value: 'range',
					text: this.$t('SurveyEditor.questionTypes.range'),
				},
				{
					value: 'checkbox',
					text: this.$t('SurveyEditor.questionTypes.checkbox'),
				},
				{
					value: 'radiogroup',
					text: this.$t('SurveyEditor.questionTypes.radiogroup'),
				},
				{
					value: 'dropdown',
					text: this.$t('SurveyEditor.questionTypes.dropdown'),
				},
				{
					value: 'rating',
					text: this.$t('SurveyEditor.questionTypes.rating'),
				},
				{
					value: 'singleChoiceMatrix',
					text: this.$t(
						'SurveyEditor.questionTypes.singleChoiceMatrix'
					),
				},
				{
					value: 'multipleChoiceMatrix',
					text: this.$t(
						'SurveyEditor.questionTypes.multipleChoiceMatrix'
					),
				},
			],
			questionIndex: 0,
			question: {},
			questionIsConditional: false,
			testedQuestionId: null,
		};
	},
	computed: {
		hasOptions() {
			return 'checkbox|radiogroup|dropdown'.includes(this.question.type);
		},
		questionsFromPrevSheets() {
			return (this.project?.sheets || [])
				.filter(s => s.ord < this.sheet?.ord && s.survey)
				.map(s => JSON.parse(s.survey)?.questions)
				.flat();
		},
		questionsFromNextSheets() {
			return (this.project?.sheets || [])
				.filter(s => s.ord > this.sheet?.ord && s.survey)
				.map(s => JSON.parse(s.survey)?.questions)
				.flat();
		},
		testableQuestions() {
			const self = this;
			return [
				...this.questionsFromPrevSheets,
				...this.survey.questions.slice(0, this.questionIndex),
			].filter(q => !self.isQuestionConditional(q) && q.type !== 'text');
		},
		canAddNewCondition() {
			const showIf = this.question?.showIf || [];
			return this.questionIsConditional && showIf[0]?.length === 2;
		},
	},
	watch: {
		value() {
			this.survey = JSON.parse(this.value || '{}');
		},
	},
	methods: {
		addQuestion() {
			const id = new Date().getTime();
			const label =
				this.$t('SurveyEditor.questionPrefix') +
				` #${this.survey.questions.length + 1}`;
			const q = {
				id,
				label,
				type: 'text',
				showResult: false,
			};
			this.survey.questions.push(q);
			this.emitSurvey();
			this.editQuestion(this.survey.questions.length - 1);
		},
		canHaveResults(q) {
			return q.type && q.type !== 'text';
		},
		editQuestion(i) {
			this.questionIndex = i;
			this.question = { ...this.survey.questions[i] };

			const showIf = (this.question?.showIf || []).filter(
				c => c?.length === 2
			);
			this.questionIsConditional = !!showIf.length;

			this.$bvModal.show('survey-question-editor');
		},
		async delQuestion(i) {
			const confirmed = await this.confirmDeletion(
				this.survey.questions[i].label
			);
			if (confirmed) {
				this.survey.questions.splice(i, 1);
				this.emitSurvey();
			}
		},
		saveQuestion() {
			// if (!this.$refs.form.reportValidity()) return;
			// TODO not working on OK button because that closes the modal auto

			this.$bvModal.hide('survey-question-editor');
			if (!this.hasOptions) {
				this.$delete(this.question, 'options');
			}
			if (Array.isArray(this.question.showIf)) {
				this.question.showIf = this.question.showIf.filter(
					c => c?.length === 2
				);
			}
			this.$set(this.survey.questions, this.questionIndex, this.question);
			this.emitSurvey();
		},
		emitSurvey() {
			if (this.readonly) {
				return true;
			}
			this.$emit('input', JSON.stringify(this.survey));
		},
		inputValid(max) {
			if (
				!this.question.options ||
				!max ||
				max < 1 ||
				max >= this.question.options.length
			) {
				this.question.max = '';
			}
		},
		toggleConditional() {
			if (this.questionIsConditional) {
				this.addNewCondition();
			} else {
				this.$delete(this.question, 'showIf');
			}
		},
		addNewCondition() {
			const existing = this.question?.showIf || [];
			this.$set(this.question, 'showIf', [...existing, []]);
		},
		deleteCondition(i) {
			if (this.question.showIf.length === 1) {
				this.questionIsConditional = false;
				this.toggleConditional();
			} else {
				this.question.showIf.splice(i, 1);
			}
		},
		isQuestionConditional(question) {
			return Array.isArray(question.showIf) && question.showIf.length;
		},
		referencedQuestionIdsOf(question) {
			return Array.isArray(question.showIf)
				? question.showIf.map(c => c[0][0])
				: [];
		},
		questionIdsThatReference(question) {
			return [...this.survey.questions, ...this.questionsFromNextSheets]
				.filter(q => {
					const refIds = this.referencedQuestionIdsOf(q);
					return refIds.includes(question.id);
				})
				.map(q => q.id);
		},
		indexOfQuestionId(id) {
			return this.survey.questions.findIndex(q => q.id === id);
		},
		isQuestionReferenced(question) {
			return this.questionIdsThatReference(question).length;
		},
		canMoveQuestion({ draggedContext }) {
			const { index, futureIndex } = draggedContext;
			const question = this.survey.questions[index];

			// conditional questions cannot be moved above
			// their referenced questions
			const refIds = this.referencedQuestionIdsOf(question);
			if (refIds.length) {
				const refInd = refIds.map(this.indexOfQuestionId);
				const minInd = Math.max(...refInd) + 1;
				return futureIndex >= minInd;
			}

			// referenced questions cannot be moved below
			// those questions that reference them
			const conIds = this.questionIdsThatReference(question);
			if (conIds.length) {
				const conInd = conIds.map(this.indexOfQuestionId);
				const maxInd = Math.min(...conInd) - 1;
				return futureIndex <= maxInd;
			}

			return true;
		},
	},
};
</script>
