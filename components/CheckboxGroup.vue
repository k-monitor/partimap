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
		{{asd()}}
	</div>
</template>

<script>
export default {
	name: 'CheckDisabled',
	props: {
		question: {
			type: Object,
			default: () => {
			},
		},
		answers: {
			type: Object,
			default: () => {
			},
		}
	},
	data() {
		return {
			selected: [],
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
			// console.log(this.answers[this.question.id]);
		}
	},
	watch: {
		selected(answer) {
			// console.log(this.selected);
			console.log(this.checkedList);
			if (this.selected.length >= this.question.max) {
				const result = this.checkedList.filter(x => !this.selected.includes(x.name));
				result.map(item => (item.disabled = true));
			} else {
				this.checkedList.map(item => (item.disabled = false));
			}
			this.$emit('inputCheckBox', this.selected, this.checkedList);
		}
	},
};
</script>

<style scoped>

</style>
