<template>
	<div>
		<table class="table table-hover">
			<th>
				<div>
					<div class="header"></div>
					<div class="header" v-for="column in question.column" :key="column.id">
						{{ column }}
					</div>
				</div>
			</th>
			<tr v-for="row in question.row" :key="row.id">
				<RadioRows
					v-model="selected[row]"
					:question="question"
					:row="row"
				/>
			</tr>
		</table>
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
		selected: {
			handler(a) {
				console.log('SingleChoice: ' + JSON.stringify(a));
				console.log('SingleChoice: ' + a);
				this.$emit('input', this.selected);
			},
			deep: true,
		},
	},
};
</script>

<style scoped>
.table{
	overflow-x:auto;
	width:auto;
}
.header{
	width:150px!important; /* or whatever width you want. */
	max-width:150px!important; /* or whatever width you want. */
	display: inline;
}
tr:hover {background-color: rgb(227, 227, 227);}
</style>
