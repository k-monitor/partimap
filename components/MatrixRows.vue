<template>
	<div>
		<tr>
			<td class="table-row">{{row}}</td>
			<td v-for="column in question.column" :key="column" class="table-row" >
				<div v-if="question.type === 'singleChoiceMatrix'">
					<b-form-radio
						v-model="radioSelected"
						:value="column"
						:name="row"
						:required="question.required"
					></b-form-radio>
				</div>
				<div v-if="question.type === 'multipleChoiceMatrix'">
					<b-form-checkbox
						v-model="checkSelected"
						:value="column"
						:name="row"
						:required="question.required && (checkSelected || []).length < 1"
					></b-form-checkbox>
				</div>
			</td>
		</tr>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: [String, Array],
			default: () => '',
		},
		column: {
			type: Array,
			default: () => [],
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
.table-row{
	min-width:90px;
	max-width:90px;
	word-wrap: break-word;
	text-align: center;
	vertical-align: middle!important;
}
</style>
