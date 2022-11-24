<template>
	<div>
		<table class="table table-hover">
			<tr>
				<td class="header" v-for="column in question.column" :key="column.id">
					{{ column }}
				</td>
			</tr>
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
		// selected: {
		// handler(a) {
		// console.log('SingleChoice: ' + Object.values(JSON.stringify(this.selected)));
		// console.log('SingleChoice: ' + Object.values(this.selected));
		// this.$emit('input', this.selected);
		// },
		// deep: true,
		// },
		selected(a) {
			console.log('sima SingleChoice: ' + a);
			console.log('SingleChoice: ' + Object.values(JSON.stringify(this.selected)));
			console.log('SingleChoice: ' + Object.values(this.selected));
			this.$emit('input', this.selected);
		}
	},
};
</script>

<style scoped>
.table{
	overflow-x:auto;
	width:auto;
	vertical-align: inherit;
}
.header{
}
td.header:first-child {
	margin-left: 100px;
}
tr:hover {background-color: rgb(227, 227, 227);}
</style>
