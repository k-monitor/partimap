<template>
	<div>
		<select v-model="selected">
			<option v-for="item in options" :key="item.text" :value="{value: item.text, text: item.value }">
				{{ item.name }}
			</option>
		</select>
		<div>{{this.question}}</div>
		<b-form-select
			v-model="selected"
			:options="options"
			:required="q.required"
		/>
		<span
			v-if="q.required && this.selected == 'other'"
			class="text-danger"
		>*</span>
		<strong
			v-if="this.selected == 'other'"
			class="text-primary">Egyéb: </strong>
		<b-form-input
			v-if="this.selected == 'other'"
			v-model="selected2"
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
			this.options.push({ text: 'Egyéb', value: 'other' });
		}
		// console.log(this.selected);
		// console.log(this.selected);
		// if (this.selected.startsWith('other')) {
		// this.options = Object.assign({}, this.q.options);
		// this.options = Object.keys(this.options).slice(0, this.options.size).map(key => (
		// { id: parseInt(key), text: this.options[key], value: this.options[key] }));
		// if (this.q.other) {
		// this.options.push({ id: this.options.length, text: 'Egyéb', value: 'other' });
		// this.question.isSelected = false;
		// }
	},
	data() {
		return {
			selected: (this.value === 'other' ? 'other' : this.value),
			selected2: (this.value.startsWith('other') ? this.value.slice(5) : this.value),
			a: this.answers,
			options: this.q.options,
			question: this.q,
		};
	},
	watch: {
		selected(a) {
			console.log(this.selected);
			if (this.value.startsWith('other')) {
				this.$emit('input', 'other');
			}
			this.$emit('input', a);
		},
		selected2(a) {
			console.log(this.selected2);
			if (this.value.startsWith('other')) {
				this.$emit('input', 'other: ' + a);
			}
			this.$emit('input', a);
		},
	},
};
</script>

<style scoped>

</style>
