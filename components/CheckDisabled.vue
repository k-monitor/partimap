<template>
	<div>
		<b-form-checkbox-group
			v-model="selected"
			:options="surveyEx"
			value-field="name"
			text-field="name"
			stacked
			@input="maxAssign(questions)"
		></b-form-checkbox-group>
	</div>
</template>

<script>
export default {
	name: 'CheckDisabled',
	// eslint-disable-next-line vue/require-prop-types
	props: {
		questions: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			selected: [], // Must be an array reference!
			surveyEx: [],
		};
	},
	mounted() {
		// eslint-disable-next-line vue/no-mutating-props,vue/no-side-effects-in-computed-properties
		this.surveyEx = Object.assign({}, this.questions.options);
		// eslint-disable-next-line vue/no-side-effects-in-computed-properties
		this.surveyEx = Object.keys(this.surveyEx).slice(0, this.surveyEx.size).map(key => (
			{ name: this.surveyEx[key], disabled: false }));
	},
	methods: {
		maxAssign(q) {
			if (this.selected.length >= q.max) {
				const result = this.surveyEx.filter(x => !this.selected.includes(x.name));
				result.map(item => (item.disabled = true));
			} else {
				this.surveyEx.map(item => (item.disabled = false));
			}
		},
	},
	watch: {
		selected: {
			handler() {
				this.$emit('inputCheckBox', this.questions.id, this.selected);
			},
		},
	},
};
</script>

<style scoped>

</style>
