<template>
	<div>
		<div>{{this.question}}</div>
		<b-form-select
			v-model="selected"
			:options="options"
			:required="q.required"
		/>
		<span
			v-if="q.required && this.selected == 'other: '"
			class="text-danger"
		>*</span>
		<strong
			v-if="this.selected == 'other: '"
			class="text-primary">Egyéb: </strong>
		<b-form-input
			v-if="this.selected == 'other: '"
			v-model="otherValue"
			:required="q.required"
		/>
	</div>
</template>

<script>
export default {
	name: 'DropdownOther',
	props: {
		q: {
			type: Object,
			default: () => {},
		},
		answers: {
			type: Object,
			default: () => {},
		},
		value: {
			type: String,
			default: () => '',
		},
	},
	mounted() {
		this.options = Object.assign({}, this.q.options);
		this.options = Object.keys(this.options).slice(0, this.options.size).map(key => (
			{ text: this.options[key], value: this.options[key] }));
		if (this.q.other) {
			this.options.push({ text: 'Egyéb', value: 'other: ' });
		}
	},
	data() {
		return {
			selected: (this.value.startsWith('other: ') ? 'other: ' : this.value),
			otherValue: (this.value.startsWith('other: ') ? this.value.slice(7) : this.value),
			a: this.answers,
			options: this.q.options,
			question: this.q,
		};
	},
	watch: {
		selected(a) {
			this.otherValue = '';
			this.$emit('input', a);
		},
		selected2(a) {
			this.$emit('input', 'other: ' + a);
		},
	},
};
</script>

<style scoped>

</style>
