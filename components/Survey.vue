<template>
	<div>
		<b-form-group
			v-for="q in questions"
			:key="q.id"
			:label="q.label"
		>
			<b-form-input
				v-if="q.type === 'text'"
				v-model="answers[q.id]"
			/>
			<div
				v-else-if="q.type === 'number'"
				class="align-items-center d-flex"
			>
				<b-form-input
					v-model="answers[q.id]"
					:min="q.min"
					:max="q.max"
					type="range"
				/>
				<strong class="ml-2 text-right" style="min-width: 2rem">{{ answers[q.id] }}</strong>
			</div>
			<b-form-checkbox-group
				v-else-if="q.type === 'checkbox'"
				v-model="answers[q.id]"
				:options="q.options"
				stacked
			/>
			<b-form-radio-group
				v-else-if="q.type === 'radiogroup'"
				v-model="answers[q.id]"
				:options="q.options"
				stacked
			/>
			<b-form-select
				v-else-if="q.type === 'dropdown'"
				v-model="answers[q.id]"
				:options="q.options"
			/>
			<b-form-rating
				v-else-if="q.type === 'rating'"
				v-model="answers[q.id]"
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
			return s.questions;
		},
	},
	watch: {
		answers: {
			handler(a) {
				this.$emit('input', a);
			},
			deep: true,
		},
	},
};
</script>