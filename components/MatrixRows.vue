<template>
	<div class="d-table-row border-top hover-row">
		<div class="align-middle d-table-cell text-left text-break ">{{ row }}</div>
		<div v-for="column in question.columns" :key="column" class="align-middle d-table-cell py-3">
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
.hover-row:hover {
	background-color: rgb(227, 227, 227);
}
</style>
