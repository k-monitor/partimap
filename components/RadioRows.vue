<template>
	<tbody>
		<td v-for="column in question.column" :key="column.id">
			<b-form-radio
				:value="[{ [row]: column }]"
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
		};
	},
	watch: {
		selected() {
			// eslint-disable-next-line array-callback-return,no-unused-vars
			let i = 0;
			let result = 0;
			// eslint-disable-next-line array-callback-return,no-unused-vars
			result = this.question.row.map(rowindex => {
				i++;
				if (this.row === rowindex) {
					return i;
				}
			});
			console.log(this.question.row.length);
			// this.selected.splice(rowIndex, 1, { value: { [row]: column } });
			this.$emit('input', this.selected);
		},
	},
};
</script>
