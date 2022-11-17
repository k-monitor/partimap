<template>
	<tbody>
		<td v-for="column in question.column" :key="column.id">
			<b-form-radio
				:value="[{ [row]: column }, {[row]: column }, {[row]: column } ]"
				v-model="selected"
				class="mb-3"
			></b-form-radio>
		</td>
		{{selected}}
	</tbody>
</template>

<script>
export default {
	props: {
		value: {
			type: Array,
			default: () => [],
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
			selected: this.value,
			picked: [],
		};
	},
	watch: {
		selected(a) {
			// console.log(this.picked);
			// this.picked.push(a);
			// console.log(this.picked);
			// this.selected.splice(rowIndex, 1, { value: { [row]: column } });
			this.$emit('input', this.selected);
		},
	},
	mounted() {
		console.log('mounted: ' + JSON.stringify(this.selected));
	}
};
</script>
