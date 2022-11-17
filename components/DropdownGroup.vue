<template>
	<div>
		<b-form-select
			v-model="selected"
			:options="options"
			:required="q.required"
		/>
		<span
			v-if="q.required && selected == other"
			:required="q.required"
			class="text-danger"
		>*</span>
		<strong
			v-if="selected == other"
			:required="q.required"
			class="text-primary"
		>Egyéb: </strong>
		<b-form-input
			v-if="selected == other"
			:required="q.required"
			v-model="otherValue"
		/>
	</div>
</template>

<script>
export default {
	props: {
		q: {
			type: Object,
			default: () => {},
		},
		value: {
			type: String,
			default: () => '',
		},
	},
	data() {
		const OTHER_PREFIX = 'other: ';
		return {
			selected: this.value.startsWith(OTHER_PREFIX) ? OTHER_PREFIX : this.value,
			otherValue: this.value.startsWith(OTHER_PREFIX)
				? this.value.slice(OTHER_PREFIX.length)
				: '',
			options: this.q.options,
			other: OTHER_PREFIX,
		};
	},
	computed: {
		answer() {
			return this.selected === this.other
				? this.other + this.otherValue
				: this.selected;
		},
	},
	watch: {
		answer() {
			this.$emit('input', this.answer);
		},
	},
	mounted() {
		this.options = Object.assign({}, this.q.options);
		this.options = Object.keys(this.options)
			.slice(0, this.options.size)
			.map(key => ({ text: this.options[key], value: this.options[key] }));
		if (this.q.other) {
			this.options.push({ text: 'Egyéb...', value: this.other });
		}
	},
};
</script>

<style scoped>
</style>
