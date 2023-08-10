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
			type: Array,
			default: () => [],
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
		serializedAnswer() {
			if (
				this.isNumberQuestion &&
				Number.isInteger(this.min) &&
				Number.isInteger(this.max)
			) {
				return `${this.min}-${this.max}`;
			}
			return this.answer;
		},
		condition() {
			return this.serializeCondition();
		},
	},
	watch: {
		value(v) {
			this.deserializeCondition();
		},
		condition(nc, oc) {
			const ncj = JSON.stringify(nc);
			const ocj = JSON.stringify(oc);
			if (nc && ncj !== ocj) this.$emit('input', nc);
		},
	},
	mounted() {
		this.deserializeCondition();
	},
	methods: {
		deserializeCondition() {
			// ['questionId', 'min-max']
			// ['questionId', 'option']
			// ['matrixQuestionId', 'matrixRow', 'option']
			if (!Array.isArray(this.value)) return;
			const [e1, e2, e3] = this.value;

			let ans = null;
			let qid = null;
			if (this.value.length === 3) {
				qid = [e1, e2];
				ans = e3;
			} else if (this.value.length === 2) {
				qid = [e1];
				ans = e2;
			}
			if (ans?.match(/^\d+-\d+/)) {
				const nums = ans.split('-').map(p => Number(p));
				this.min = nums[0];
				this.max = nums[1];
			} else {
				this.answer = ans;
			}
			this.questionId = qid;
		},
		serializeCondition() {
			if (!this.question || !this.serializedAnswer) return null;
			return [...this.questionId, this.serializedAnswer];
		},
	},
};
</script>
