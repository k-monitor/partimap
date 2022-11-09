<template>
	<div>
		<div class="table table-striped table-bordered table-sm">
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
						v-model="selected"
						:question="question"
						:row="row"
					/>
				</tr>
			</table>
		</div>
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
	watch: {
		selected() {
			this.$emit('input', this.selected);
		},
	},
};
</script>

<style scoped>
.table{
	overflow-x:auto;
}
</style>
