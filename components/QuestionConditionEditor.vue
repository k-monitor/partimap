<template>
	<!-- FIXME i18n -->
	<div>
		<div class="bg-info">value = {{ JSON.stringify(value) }}</div>
		<b-form-group label="a következő kérdésre">
			<b-form-select
				v-model="questionId"
				:options="questionOptions"
			/>
		</b-form-group>
		<b-form-group label="az alábbi választ adják">
			<b-form-select
				v-if="!question"
				disabled
			/>
			<b-form-select
				v-else-if="hasOptions"
				v-model="answer"
				:options="answerOptions"
			/>
			<div
				v-else-if="isNumberQuestion"
				class="d-flex"
			>
				<b-form-input
					v-model.number="min"
					type="number"
				/>
				<div class="form-control-label mx-2">-</div>
				<b-form-input
					v-model.number="max"
					type="number"
				/>
			</div>
		</b-form-group>
		<div class="bg-success">{{ condition }}</div>
	</div>
</template>

<script>
export default {
	props: {
		testableQuestions: {
			type: Array,
			default: () => [],
		},
		value: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			answer: null,
			max: null,
			min: null,
			questionId: null,
		};
	},
	computed: {
		questionOptions() {
			return this.testableQuestions.map(q => {
				if (q.type.includes('Matrix')) {
					return {
						label: q.label,
						options: q.rows.map(r => ({
							value: [q.id, r],
							text: r,
						})),
					};
				} else {
					return {
						value: [q.id],
						text: q.label,
					};
				}
			});
		},
		question() {
			const question = this.testableQuestions.find(
				q => String(q.id) === String((this.questionId || [])[0])
			);
			return question;
		},
		hasOptions() {
			return 'checkbox|dropdown|radiogroup|singleChoiceMatrix|multipleChoiceMatrix'.includes(
				this.question?.type
			);
		},
		isNumberQuestion() {
			return 'number|range|rating'.includes(this.question?.type);
		},
		answerOptions() {
			return this.question?.columns || this.question?.options;
		},
		condition() {
			return this.serializeCondition();
		},
	},
	watch: {
		value() {
			this.deserializeCondition();
		},
		condition(c) {
			if (c) this.$emit('input', c);
		},
	},
	mounted() {
		this.deserializeCondition();
	},
	methods: {
		deserializeCondition() {
			// FIXME parse this.value into data fields
		},
		serializeCondition() {
			if (this.hasOptions && this.answer) {
				const questionId = this.questionId[0];
				const option = this.questionId[1];
				return option
					? { [questionId]: { [option]: this.answer } }
					: { [questionId]: this.answer };
			}
			if (
				this.isNumberQuestion &&
				Number.isInteger(this.min) &&
				Number.isInteger(this.max)
			) {
				const questionId = this.questionId[0];
				return { [questionId]: `${this.min}-${this.max}` };
			}
			return null;
		},
	},
};
</script>
