<template>
	<div class="d-table-row">
		<div class="d-table-cell align-middle border-top p-1 position-relative">
			{{ row }}
			<input
				v-if="
					question.type === 'multipleChoiceMatrix' &&
					question.required &&
					(checkSelected || []).length < 1
				"
				:oninvalid="`this.setCustomValidity('${$t(
					'CheckboxGroup.required'
				)}')`"
				required
				type="checkbox"
				style="bottom: 0; opacity: 0; position: absolute; right: 0"
			/>
		</div>
		<div
			v-for="column in question.columns"
			:key="column"
			class="d-table-cell align-middle border-top py-3 text-center"
		>
			<div v-if="question.type === 'singleChoiceMatrix'">
				<b-form-radio
					v-model="radioSelected"
					:value="column"
					:name="`${question.id}/${row}`"
					:required="question.required"
				/>
			</div>
			<div v-if="question.type === 'multipleChoiceMatrix'">
				<b-form-checkbox
					v-model="checkSelected"
					:value="column"
					:name="`${question.id}/${row}`"
				/>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: [String, Array],
			default: () => null,
		},
		row: {
			type: String,
			default: () => '',
		},
		question: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			checkSelected: this.value || [],
			radioSelected: this.value,
		};
	},
	watch: {
		value(v) {
			if (this.question.type === 'singleChoiceMatrix') {
				this.radioSelected = v;
			} else {
				// multipleChoiceMatrix
				this.checkSelected = v || [];
			}
		},
		radioSelected(v) {
			if (v) {
				this.$emit('input', v);
			}
		},
		checkSelected(v) {
			this.$emit('input', v);
		},
	},
};
</script>
<style scoped>
.custom-control {
	padding-left: 1.75rem;
}

.d-table-row:hover .d-table-cell {
	background-color: #e9ecef;
}

.d-table-cell {
	min-width: 60px;
}
</style>
