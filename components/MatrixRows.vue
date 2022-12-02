<template>
	<div>
		<div class="d-table-cell font-weight-bold text-left text-break align-middle">{{ row }}</div>
		<div v-for="column in question.columns" :key="column" class="d-table-cell align-middle py-3">
			<div v-if="question.type === 'singleChoiceMatrix'">
				<b-form-radio
					v-model="radioSelected"
					:value="column"
					:name="row"
					:required="question.required"
				/>
			</div>
			<div v-if="question.type === 'multipleChoiceMatrix'">
				<b-form-checkbox
					v-model="checkSelected"
					:value="column"
					:name="row"
					:required="question.required && (checkSelected || []).length < 1"
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
			default: () => '',
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
			radioSelected: this.value,
			checkSelected: this.value || [],
		};
	},
	watch: {
		radioSelected() {
			this.$emit('input', this.radioSelected);
		},
		checkSelected() {
			this.$emit('input', this.checkSelected);
		},
	},
};
</script>
<style scoped>
.d-table-cell {
	min-width: 90px;
	max-width: 90px;
}
</style>
