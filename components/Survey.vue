<template>
	<div>
		<b-form-group
			v-for="q in questions"
			:key="q.id"
		>
			<template #label>
				<span v-if="q.required" class="text-danger">*</span>
				{{ q.label }}
			</template>
			<b-form-input
				v-if="q.type === 'text'"
				v-model="answers[q.id]"
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
			<b-form-checkbox-group
				v-else-if="q.type === 'checkbox'"
				v-model="answers[q.id]"
				:name="'q' + q.id"
				:options="q.options"
				:required="q.required"
				stacked
			/>
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
				:options="q.options"
			/>
			<b-form-rating
				v-else-if="q.type === 'rating'"
				v-model="answers[q.id]"
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
