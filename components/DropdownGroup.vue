<template>
	<div>
		<div>{{this.options}}</div>
		<select v-model="selected">
			<option v-for="item in options" :key="item.text" :value="{value: item.text, text: item.value }">
				{{ item.name }}
			</option>
		</select>
		<b-form-select
			v-model="selected"
			:value="{ value: q.name, text: q.name }"
			:name="'q' + q.id"
			:options="options"
			:required="q.required"
		/>
		<div>{{this.selected}}</div>
		<span
			v-if="q.required && this.selected.text == 'Egyéb'"
			class="text-danger"
		>*</span>
		<strong
			v-if="this.selected === 'Egyéb: '"
			class="text-primary">Egyéb: </strong>
		<b-form-input
			v-if="q.type === 'dropdown' && this.selected === 'Egyéb: '"
			v-model="selected"
			:name="'q' + q.id"
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
		console.log(this.options);
	},
	data() {
		return {
			selected: this.value,
			a: this.answers,
			options: this.q.options,
		};
	},
	watch: {
		selected() {
			// console.log(this.options[this.options.length - 1].text);
			console.log(this.selected);
			this.$emit('input', this.selected);
		}
	},
};
</script>

<style scoped>

</style>
