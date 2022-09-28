<template>
	<div>
		<b-form-group
			v-for="q in questions"
			:key="q.id"
			class="my-4"
		>
			<template #label>
				<span
					v-if="q.required"
					class="text-danger"
				>*</span>
				<strong class="text-primary">{{ q.label }}</strong>
			</template>
			<CheckboxGroup
				v-if="q.type == 'checkbox'"
				v-model="answers[q.id]"
				:answers="answers"
				:question="q"
			/>
			<b-form-input
				v-if="q.type === 'text'"
				v-model="answers[q.id]"
				:name="'q' + q.id"
				:required="q.required"
			/>
			<div v-else-if="'number|range'.includes(q.type)">
				<div
					v-if="q.type === 'range' && q.minLabel && q.maxLabel"
					class="align-items-end d-flex justify-content-between small"
				>
					<span>{{ q.minLabel }}</span>
					<strong>{{ answers[q.id] }}</strong>
					<span>{{ q.maxLabel }}</span>
				</div>
				<div class="align-items-center d-flex">
					<b-form-input
						v-model="answers[q.id]"
						:min="q.min"
						:max="q.max"
						:name="'q' + q.id"
						:required="q.required"
						:type="q.type"
					/>
					<strong
						v-if="q.type == 'range' && (!q.minLabel || !q.maxLabel)"
						class="ml-2 text-right"
						style="min-width: 2rem"
					>{{ answers[q.id] }}</strong>
				</div>
			</div>
			<b-form-radio-group
				v-else-if="q.type === 'radiogroup'"
				v-model="answers[q.id]"
				:name="'q' + q.id"
				:options="q.options"
				:required="q.required"
				stacked
			/>
			<b-form-select
				v-else-if="q.type === 'dropdown'"
				v-model="answers[q.id]"
				:name="'q' + q.id"
				:options="q.options"
				:required="q.required"
			/>
			<span
				v-if="q.required && q.type === 'dropdown' && answers[q.id] === 'Egyéb'"
				class="text-danger"
			>*</span>
			<strong
				v-if="q.type === 'dropdown' && answers[q.id] === 'Egyéb'"
				class="text-primary">Egyéb: </strong>
			<b-form-input
				v-if="q.type === 'dropdown' && answers[q.id] === 'Egyéb'"
				:velue="answers[q.id]"
				:required="q.required"
				:name="'q' + q.id"
				@input="otherAnswerFunct(q)"
			/>
			<b-form-rating
				v-else-if="q.type === 'rating'"
				v-model="answers[q.id]"
				:name="'q' + q.id"
				:required="q.required"
				variant="warning"
			/>
		</b-form-group>
	</div>
</template>

<script>
export default {
	props: {
		survey: {
			type: String, // survey definition as JSON string
			default: '{}',
		},
		value: {
			type: Object, // answers
			default: () => {},
		},
	},
	data() {
		return {
			answers: this.value || {},
			disable: false,
			otherAnswer: '',
			otherfill: false,
		};
	},
	computed: {
		questions() {
			let s;
			try {
				s = JSON.parse(this.survey);
			} catch (e) {
				s = {};
			}
			if (!s.questions) {
				s.questions = [];
			}
			// eslint-disable-next-line array-callback-return
			s.questions.map(x => {
				if (x.other) {
					x.options.push('Egyéb');
				}
			});
			// console.log(s.questions);
			return s.questions;
		}
	},
	watch: {
		answers: {
			handler(a) {
				// console.log(this.otherfill);
				// const st = a.slice(0, 5);
				// console.log(a);
				console.log(a);
				this.$emit('input', a);
			},
			deep: true,
		},
		otherAnswer() {
			// console.log(this.otherAnswer);
		}
	},
	methods: {
		otherAnswerFunct(q) {
			console.log(this.answers[q.id]);
			if (this.answers[q.id] === 'Egyéb') {
				// console.log(this.answers[q.id]);
			}
			// console.log(this.answers[q.id]);
			// console.log(this.otherAnswer);
			// console.log(this.otherAnswer2);
		}
	}
};
</script>
