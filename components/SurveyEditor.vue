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
									:title="$t('SurveyEditor.showResult')"
								/>
								<i
									v-if="isQuestionReferenced(q)"
									v-b-tooltip.hover.bottom
									class="fas fa-level-up-alt fa-rotate-270 fa-fw mr-2"
									:class="
										cancelledDrag.includes(q.id)
											? 'alert-danger text-danger rounded'
											: ''
									"
									:title="
										$t('SurveyEditor.referencedQuestion')
									"
								/>
								<i
									v-if="isQuestionConditional(q)"
									v-b-tooltip.hover.bottom
									class="fas fa-level-up-alt fa-fw mr-2"
									:class="
										cancelledDrag.includes(q.id)
											? 'alert-danger text-danger rounded'
											: ''
									"
									:title="
										$t('SurveyEditor.conditionalQuestion')
									"
								/>
								<b-button
									v-if="!readonly && !isQuestionReferenced(q)"
									v-b-tooltip.hover.bottom
									class="border-0 ml-auto text-danger"
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
			<form
				v-if="question"
				ref="form"
				@submit.prevent="saveQuestion"
			>
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
					<b-form-group>
						<b-form-checkbox
							v-model="questionIsConditional"
							@change="toggleConditional"
						>
							{{ $t('SurveyEditor.showIf') }}
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
								<p v-if="i > 0">{{ $t('SurveyEditor.and') }}</p>
								<QuestionConditionEditor
									v-model="question.showIf[i]"
									:testable-questions="testableQuestions"
									:testable-question-options="
										questionOptionsForCond(i)
									"
								/>
								<p class="small text-right">
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
				distributeUnits: 'fa-balance-scale',
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
				{
					value: 'distributeUnits',
					text: this.$t('SurveyEditor.questionTypes.distributeUnits'),
				},
			],
			questionIndex: 0,
			question: {},
			questionIsConditional: false,
			testedQuestionId: null,
			cancelledDrag: [],
		};
	},
	computed: {
		hasOptions() {
			return 'checkbox|distributeUnits|dropdown|radiogroup'.includes(
				this.question.type
			);
		},
		questionsFromPrevSheets() {
			return (this.project?.sheets || [])
				.filter(s => s.ord < this.sheet?.ord && s.survey)
				.map(s => JSON.parse(s.survey)?.questions || [])
				.flat();
		},
		questionsFromNextSheets() {
			return (this.project?.sheets || [])
				.filter(s => s.ord > this.sheet?.ord && s.survey)
				.map(s => JSON.parse(s.survey)?.questions || [])
				.flat();
		},
		testableQuestions() {
			const self = this;
			return [
				...this.questionsFromPrevSheets,
				...this.survey.questions.slice(0, this.questionIndex),
			].filter(
				q =>
					!self.isQuestionConditional(q) &&
					q.type !== 'text' &&
					q.type !== 'distributeUnits'
			);
		},
		testableQuestionOptions() {
			function clampText(t) {
				t = t || '';
				const limit = 26;
				return t.length > limit ? `${t.substring(0, limit)}...` : t;
			}
			return this.testableQuestions.map(q => {
				if (q.type.includes('Matrix')) {
					return {
						label: clampText(q.label),
						options: q.rows.map(r => ({
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
			});
		},
		canAddNewCondition() {
			const showIf = this.question?.showIf || [];
			const condN = showIf[0]?.length || 0;
			return (
				this.questionIsConditional &&
				condN === 2 &&
				this.questionOptionsForCond(condN).length
			);
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
		saveQuestion(bvModalEvent) {
			if (!this.$refs.form.reportValidity()) {
				bvModalEvent.preventDefault();
				return;
			}

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
			this.cancelledDrag.splice(0, this.cancelledDrag.length);
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
		questionOptionsForCond(i) {
			if (!this.question || !this.question.showIf || i === 0)
				return this.testableQuestionOptions;

			const referencedIds = {}; // { questionId: [row, row], questionId: [] }
			this.question.showIf.slice(0, i).forEach(c => {
				if (!c[0]) return;
				const qid = c[0][0];
				const row = c[0][1];
				if (!qid) return;
				referencedIds[qid] = referencedIds[qid] || [];
				if (row) referencedIds[qid].push(row);
			});

			const options = [];
			this.testableQuestionOptions.forEach(o => {
				const oneCondQuestionTypes =
					'dropdown|number|radiogroup|range|rating|singleChoiceMatrix';

				if (
					!oneCondQuestionTypes.includes(o.type) ||
					!referencedIds[o.qid]
				) {
					// question can be referenced multiple times
					// or hasn't been referenced -> available
					return options.push(o);
				}

				if (o.type === 'singleChoiceMatrix') {
					// matrix questions can be used
					// but their options has to be filtered
					const option = JSON.parse(JSON.stringify(o)); // copy
					option.options = option.options.filter(
						r => !referencedIds[o.qid].includes(r.value[1])
					);
					if (option.options.length) options.push(option);
				} else if (!referencedIds[o.qid]) {
					// other questions can be added if not referenced
					options.push(o);
				}
			});
			return options;
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
			return Array.isArray(question?.showIf) && question.showIf.length;
		},
		referencedQuestionIdsOf(question) {
			return Array.isArray(question?.showIf)
				? question.showIf.map(c => c[0][0])
				: [];
		},
		questionIdsThatReference(question) {
			return [...this.survey.questions, ...this.questionsFromNextSheets]
				.filter(q => {
					const refIds = this.referencedQuestionIdsOf(q);
					return refIds.includes(question?.id);
				})
				.map(q => q.id);
		},
		questionById(id) {
			return this.survey.questions.find(q => q.id === id);
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
				const minInd = Math.max(...refInd);
				if (futureIndex < minInd + 1) {
					this.cancelledDrag.splice(0, this.cancelledDrag.length);
					this.cancelledDrag.push(
						question.id,
						this.survey.questions[minInd].id
					);
					return false;
				}
			}

			// referenced questions cannot be moved below
			// those questions that reference them
			const conIds = this.questionIdsThatReference(question);
			if (conIds.length) {
				const conInd = conIds.map(this.indexOfQuestionId);
				const maxInd = Math.min(...conInd);
				if (futureIndex > maxInd - 1) {
					this.cancelledDrag.splice(0, this.cancelledDrag.length);
					this.cancelledDrag.push(
						question.id,
						this.survey.questions[maxInd].id
					);
					return false;
				}
			}

			this.cancelledDrag.splice(0, this.cancelledDrag.length);
			return true;
		},
	},
};
</script>
