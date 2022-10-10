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
	name: 'DropdownOther',
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
	mounted() {
		this.options = Object.assign({}, this.q.options);
		this.options = Object.keys(this.options)
			.slice(0, this.options.size)
			.map(key => ({ text: this.options[key], value: this.options[key] }));
		if (this.q.other) {
			this.options.push({ text: 'Egyéb', value: this.other });
		}
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
	watch: {
		selected(a) {
			this.$emit('input', a);
		},
		otherValue(a) {
			this.$emit('input', this.other + a);
		},
	},
};
</script>

<style scoped>
</style>
