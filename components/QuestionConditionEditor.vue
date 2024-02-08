<template>
	<div>
		<b-form-group :label="$t('QuestionConditionEditor.selectQuestion')">
			<b-form-select
				v-model="questionId"
				:options="testableQuestionOptions"
				required
			/>
		</b-form-group>
		<b-form-group
			:label="$t('QuestionConditionEditor.selectAnswer') + ` ${minMax}`"
		>
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
					:max="question.max"
					:min="question.min"
					required
					type="number"
				/>
				<label class="mx-2 col-form-label">-</label>
				<b-form-input
					v-model.number="max"
					:max="question.max"
					:min="question.min"
					required
					type="number"
				/>
			</div>
		</b-form-group>
	</div>
</template>

<script>
export default {
	props: {
		testableQuestions: {
			type: Array,
			default: () => [],
		},
		testableQuestionOptions: {
			type: Array,
			default: () => [],
		},
		value: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			answer: null,
			max: null,
			min: null,
			questionId: [],
		};
	},
	computed: {
		question() {
			const question = this.testableQuestions.find(
				q => String(q.id) === String((this.questionId || [])[0])
			);
			if (question) {
				question.min = 0;
				question.max = question.max || 100;
			}
			return question;
		},
		hasOptions() {
			return 'checkbox|dropdown|radiogroup|singleChoiceMatrix|multipleChoiceMatrix'.includes(
				this.question?.type
			);
		},
		isNumberQuestion() {
			return 'distributeUnits|number|range|rating'.includes(
				this.question?.type
			);
		},
		minMax() {
			if (!this.question?.type) return '';
			if (this.question.type === 'rating') return '(1-5)';
			const hasMin = typeof this.question.min !== 'undefined';
			const hasMax = typeof this.question.max !== 'undefined';
			if (hasMin && hasMax) {
				return `(${this.question.min}-${this.question.max})`;
			}
			return '';
		},
		answerOptions() {
			const t = this.question?.type || '';
			return t.includes('Matrix')
				? this.question?.columns
				: this.question?.options;
		},
		serializedAnswer() {
			if (this.isNumberQuestion) {
				if (Number.isInteger(this.min) && Number.isInteger(this.max)) {
					return `${this.min}-${this.max}`;
				} else {
					return null;
				}
			}
			return this.answer;
		},
		condition() {
			return this.serializeCondition();
		},
	},
	watch: {
		value() {
			this.deserializeCondition();
		},
		condition(nc, oc) {
			const ncj = JSON.stringify(nc);
			const ocj = JSON.stringify(oc);
			if (ncj !== ocj) this.$emit('input', nc);
		},
	},
	mounted() {
		this.deserializeCondition();
	},
	methods: {
		deserializeCondition() {
			// [['questionId'], 'min-max']
			// [['questionId'], 'option']
			// [['matrixQuestionId', 'matrixRow'], 'option']
			if (!Array.isArray(this.value)) return [];
			const [qid, ans] = this.value;
			this.questionId = qid;
			if (ans?.match(/^\d+-\d+/)) {
				const nums = ans.split('-').map(p => Number(p));
				this.min = nums[0];
				this.max = nums[1];
			} else {
				this.answer = ans;
			}
		},
		serializeCondition() {
			return this.serializedAnswer
				? [this.questionId, this.serializedAnswer]
				: [this.questionId];
		},
	},
};
</script>
