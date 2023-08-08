<template>
	<div>
		<b-list-group class="mb-3">
			<draggable
				v-model="survey.questions"
				:draggable="readonly ? null : '.item'"
				handle=".handle"
				@end="emitSurvey"
			>
				<b-list-group-item
					v-for="(q, i) in survey.questions"
					:key="q.id"
					button
					class="d-flex item p-0"
				>
					<b-button
						class="handle border-0 flex-shrink-0 py-3 rounded-0 text-center"
						variant="light"
						style="width: 32px"
					>
						<i class="fas fa-grip-vertical" />
					</b-button>
					<div
						class="d-flex align-items-center flex-grow-1 px-1 py-3 overflow-hidden"
						@click="editQuestion(i)"
					>
						<i
							class="fas fa-fw flex-shrink-0 mr-1"
							:class="icon[q.type]"
						/>
						<strong class="flex-grow-1 text-truncate">
							{{ q.label }}
						</strong>
					</div>
					<div class="px-1 py-3">
						<i
							v-if="q.showResult && canHaveResults(q)"
							class="fas fa-chart-bar fa-fw text-muted"
						/>
					</div>
					<b-button
						v-if="!readonly"
						class="border-0 px-2 py-3 rounded-0 text-danger"
						variant="light"
						@click.stop="delQuestion(i)"
					>
						<i class="fas fa-fw fa-trash" />
					</b-button>
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
			<b-form @submit.prevent="saveQuestion">
				<b-form-group :label="$t('SurveyEditor.questionText')">
					<b-form-input
						ref="questionLabelInput"
						v-model="question.label"
						:readonly="readonly"
						:disabled="readonly"
					/>
				</b-form-group>
				<b-form-group :label="$t('SurveyEditor.questionType')">
					<b-form-select
						v-model="question.type"
						:options="questionTypes"
						:disabled="readonly"
					/>
				</b-form-group>
				<b-row v-if="'number|range'.includes(question.type)">
					<b-col>
						<b-form-group :label="$t('SurveyEditor.minValue')">
							<b-form-input
								v-model="question.min"
								type="number"
							/>
						</b-form-group>
					</b-col>
					<b-col>
						<b-form-group :label="$t('SurveyEditor.maxValue')">
							<b-form-input
								v-model="question.max"
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
					:readonly="readonly"
					label-state="option"
				/>
				<OptionsEditor
					v-if="
						'singleChoiceMatrix|multipleChoiceMatrix'.includes(
							question.type
						)
					"
					v-model="question.rows"
					:readonly="readonly"
					label-state="row"
				/>
				<OptionsEditor
					v-if="
						'singleChoiceMatrix|multipleChoiceMatrix'.includes(
							question.type
						)
					"
					v-model="question.columns"
					:readonly="readonly"
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

				<div v-if="questionIndex > 0">
					<hr />
					<!-- FIXME i18n -->
					<b-form-group label="Csak akkor jelenjen meg, ha a(z)">
						<b-form-select
							v-model="testedQuestionId"
							:options="testableQuestionOptions"
						/>
					</b-form-group>
					<div class="text-right">
						<div
							v-if="testedQuestionId"
							class="btn btn-link"
							role="button"
							@click="testedQuestionId = null"
						>
							Feltétel törlése
						</div>
					</div>
				</div>
			</b-form>
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
		readonly: {
			type: Boolean,
			default: false,
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
			testedQuestionId: null,
		};
	},
	computed: {
		hasOptions() {
			return 'checkbox|radiogroup|dropdown'.includes(this.question.type);
		},
		testableQuestions() {
			const fq = this.survey.questions.filter(
				(q, i) =>
					i < this.questionIndex &&
					!q.showIf &&
					q.type &&
					q.type !== 'text'
			);
			return fq;
		},
		testableQuestionOptions() {
			return this.testableQuestions.map(q => {
				if (q.type.includes('Matrix')) {
					return {
						label: q.label,
						options: q.rows.map(r => ({
							value: `${q.id}/${r}`,
							text: r,
						})),
					};
				} else {
					return {
						value: q.id,
						text: q.label,
					};
				}
			});
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

			const showIf = this.question?.showIf;
			this.testedQuestionId = showIf ? showIf.split('\n')[0] : undefined;

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
			this.$bvModal.hide('survey-question-editor');
			if (!this.hasOptions) {
				this.$delete(this.question, 'options');
			}
			if (this.testedQuestionId) {
				const questionId = this.testedQuestionId;
				this.question.showIf = `${questionId}\n`;
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
	},
};
</script>
