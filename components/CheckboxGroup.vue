<template>
	<div>
		<b-form-checkbox-group
			v-model="selected"
			:options="checkedList"
			value-field="name"
			text-field="name"
			:required="question.required && (answers[question.id] || []).length < 1"
			stacked
		></b-form-checkbox-group>
		<div>{{this.selectedProps}}</div>
	</div>
</template>

<script>
export default {
	name: 'CheckDisabled',
	props: {
		question: {
			type: Object,
			default: () => {},
		},
		answers: {
			type: Object,
			default: () => {},
		},
		selectedProps: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			selected: this.selectedProps,
			checkedList: [],
		};
	},
	mounted() {
		this.checkedList = Object.assign({}, this.question.options);
		this.checkedList = Object.keys(this.checkedList).slice(0, this.checkedList.size).map(key => (
			{ name: this.checkedList[key], disabled: false }));
	},
	methods: {
		asd() {
			// this.selected = [...this.checkedList];
			// console.log(this.checkedListProps);
		}
	},
	watch: {
		selected(answer) {
			if (this.selected.length >= this.question.max) {
				const result = this.checkedList.filter(x => !this.selected.includes(x.name));
				result.map(item => (item.disabled = true));
			} else {
				this.checkedList.map(item => (item.disabled = false));
			}
			this.$emit('inputCheckBox', this.selected);
		}
	},
};
</script>

<style scoped>

</style>
