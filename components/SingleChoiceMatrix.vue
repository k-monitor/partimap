<template>
	<div>
		<div>{{question}}</div>
		<b-form-checkbox-group
			v-model="selected"
			:options="question.row"
			value-field="name"
			text-field="name"
			:required="question.required && (selected || []).length < 1"
			stacked
		/>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: Array,
			default: () => [],
		},
		question: {
			type: Object,
			default: () => {},
		},
		answers: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			a: this.answers,
			selected: this.value,
		};
	},
};
</script>

<style scoped>

</style>
