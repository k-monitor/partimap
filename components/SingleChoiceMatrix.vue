<template>
	<div>
		<table>
			<tr>
				<td></td>
				<div>
					<td v-for="item in question.row" :key="item.id">
						{{ item }}
					</td>
				</div>
			</tr>
			<tr v-for="column in question.column" :key="column.id">
				<td>
					{{column}}
				</td>
				<RadioRows
					:question="question"
					:column="column"
					:row="row"
				/>
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
		};
	},
};
</script>

<style scoped>

</style>
