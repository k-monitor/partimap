<template>
	<div>
		<di class="table table-striped table-bordered table-sm">
			<table>
				<tr>
					<th></th>
					<td md="1" offset-md="1" v-for="column in question.column" :key="column.id">
						{{ column }}
					</td>
				</tr>
			</table>
			<table>
				<tr v-for="row in question.row" :key="row.id">
					<td>
						{{row}}
					</td>
					<RadioRows
						:question="question"
						:column="column"
						:row="row"
					/>
				</tr>
			</table>
		</di>
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
		};
	},
};
</script>

<style scoped>
.table{
	overflow-x:auto;
}
</style>
