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
				v-model="checkedList"
				:answers="answers"
				:question="q"
				:selectedProps ="checkedList"
				@inputCheckBox="checkBoxDisabled"
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
			<strong
				v-if="q.type === 'dropdown' && answers[q.id] === 'Egyéb'"
				class="text-primary">Egyéb: </strong>
			<b-form-input
				v-if="q.type === 'dropdown' && answers[q.id] === 'Egyéb'"
				:value="otherString"
				:required="q.required"
				:name="'q' + q.id"
				@input="funct(otherString)"
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
			otherString: '',
			checkedList: [],
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
			return s.questions;
		}
	},
	watch: {
		answers: {
			handler(a) {
				this.$emit('input', a);
			},
			deep: true,
		},
		otherString() {
			console.log(this.otherString);
		}
	},
	methods: {
		checkBoxDisabled(selectedProps) {
			this.checkedList = selectedProps;
			console.log(this.checkedList);
		},
		funct(a) {
			console.log(a);
		}
	}
};
</script>
