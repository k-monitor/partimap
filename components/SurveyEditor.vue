<template>
	<div>
		<b-list-group class="mb-3">
			<draggable
				v-model="survey.questions"
				:draggable="readonly ? null : '.item'"
				@end="emitSurvey"
			>
				<b-list-group-item
					v-for="(q, i) in survey.questions"
					:key="q.id"
					button
					class="d-flex align-items-center item"
					@click="editQuestion(i)"
				>
					<i
						class="fas fa-fw mr-2"
						:class="icon[q.type]"
					/>
					<strong class="flex-grow-1 text-truncate">{{ q.label }}</strong>
					<span
						v-if="!readonly"
						class="text-danger"
						role="button"
						@click.stop="delQuestion(i)"
					>
						<i class="fas fa-fw fa-trash" />
					</span>
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
		<b-form-group>
			<b-form-checkbox v-model="survey.showResults">
				{{ $t('SurveyEditor.showStatsToVisitors') }}
			</b-form-checkbox>
		</b-form-group>
		<b-form-group>
			<b-form-checkbox v-model="survey.showResultsOnly">
				{{ $t('SurveyEditor.showOnlyStatsToVisitors') }}
			</b-form-checkbox>
		</b-form-group>
		<b-modal
			id="survey-question-editor"
			:cancel-title="$t('SurveyEditor.cancel')"
			:ok-disabled="readonly"
			:title="$t('SurveyEditor.questionPrefix') + ` #${questionIndex + 1}`"
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
								:max="!question.options ? 0 : question.options.length"
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
					v-if="'singleChoiceMatrix|multipleChoiceMatrix'.includes(question.type)"
					v-model="question.rows"
					:readonly="readonly"
					label-state="row"
				/>
				<OptionsEditor
					v-if="'singleChoiceMatrix|multipleChoiceMatrix'.includes(question.type)"
					v-model="question.columns"
					:readonly="readonly"
					label-state="column"
				/>
				<b-form-group v-if="'checkbox|dropdown'.includes(question.type)">
					<b-form-checkbox v-model="question.other">
						{{ $t('SurveyEditor.other') }}
					</b-form-checkbox>
				</b-form-group>
				<b-form-group>
					<b-form-checkbox v-model="question.required">{{ $t('SurveyEditor.required') }}</b-form-checkbox>
				</b-form-group>
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
		survey.showResults = !!survey.showResults;
		survey.showResultsOnly = !!survey.showResultsOnly;
		return {
			survey,
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
				{ value: 'text', text: this.$t('SurveyEditor.questionTypes.text') },
				{ value: 'number', text: this.$t('SurveyEditor.questionTypes.number') },
				{ value: 'range', text: this.$t('SurveyEditor.questionTypes.range') },
				{ value: 'checkbox', text: this.$t('SurveyEditor.questionTypes.checkbox') },
				{ value: 'radiogroup', text: this.$t('SurveyEditor.questionTypes.radiogroup') },
				{
					value: 'dropdown',
					text: this.$t('SurveyEditor.dropdown'),
				},
				{ value: 'rating', text: this.$t('SurveyEditor.questionTypes.rating') },
				{ value: 'singleChoiceMatrix', text: this.$t('SurveyEditor.questionTypes.singleChoiceMatrix') },
				{ value: 'multipleChoiceMatrix', text: this.$t('SurveyEditor.questionTypes.multipleChoiceMatrix') },
			],
			questionIndex: 0,
			question: {},
		};
	},
	computed: {
		hasOptions() {
			return 'checkbox|radiogroup|dropdown'.includes(this.question.type);
		},
	},
	watch: {
		'survey.showResults'() {
			this.emitSurvey();
		},
		'survey.showResultsOnly'() {
			this.emitSurvey();
		},
	},
	methods: {
		addQuestion() {
			const id = new Date().getTime();
			const label = this.$t('SurveyEditor.questionPrefix') + ` #${this.survey.questions.length + 1}`;
			const q = { id, label, type: 'text' };
			this.survey.questions.push(q);
			this.emitSurvey();
			this.editQuestion(this.survey.questions.length - 1);
		},
		editQuestion(i) {
			this.questionIndex = i;
			this.question = { ...this.survey.questions[i] };
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
			if (!this.question.options || !max || max < 1 || max >= this.question.options.length) {
				this.question.max = '';
			}
		},
	},
};
</script>
