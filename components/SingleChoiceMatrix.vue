<template>
	<div>
		<table>
			<tr>
				<td></td>
				<td>
					<b-list-group horizontal>
						<b-list-group-item v-for="column in question.column" :key="column.id">{{column}}</b-list-group-item>
					</b-list-group>
				</td>
			</tr>
			<tr v-for="row in question.row" :key="row.id">
				<td>
					{{row}}
				</td>
				<td>
					<RadioRows
						:column="question.column"
					/>
				</td>
			</tr>
		</table>
		{{picked}}
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: Array,
			default: () => [],
		},
		question: {
			type: Object,
			default: () => {},
		},
		answers: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			a: this.answers,
			selected: this.value,
			picked: [],
			row: this.question.row,
			column: this.question.column,
		};
	},
	mounted() {
		this.row = Object.keys(this.question.row)
			.slice(0, this.question.row.size)
			.map(key => ({ text: this.row[key], value: this.row[key] }));
		console.log(this.row);
		this.column = Object.keys(this.question.column)
			.slice(0, this.question.column.size)
			.map(key => ({ text: this.column[key] }));
		console.log(this.column);
	},
};
</script>

<style scoped>

</style>
