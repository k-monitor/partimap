<template>
	<div>
		<td class="tablerow">{{row}}</td>
		<td class="tablerow" v-for="column in question.column" :key="column.id">
			<b-form-radio
				:value="{ [row]: column }"
				v-model="selected"
				class="mb-3"
			></b-form-radio>
		</td>
		{{selected}}
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: Object,
			default: () => {},
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
			console.log('radioRow: ' + JSON.stringify(a));
			this.$emit('input', this.selected);
		},
	},
	mounted() {
		// console.log('mounted: ' + JSON.stringify(this.selected));
	}
};
</script>
<style scoped>
.tablerow{
	width:100px;
}
</style>
