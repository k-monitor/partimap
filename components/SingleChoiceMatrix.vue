<template>
	<div>
		<table>
			<tr>
				<td></td>
				<td v-for="item in question.row" :key="item.id">
					{{ item }}
				</td>
			</tr>
			<tr v-for="column in question.column" :key="column.id">
				<td>
					{{column}}
				</td>
				<td v-for="row in question.row" :key="row.id">
					<b-form-radio
						:value="row + ' ' + column"
						v-model="picked"
						class="mb-3"
					></b-form-radio>
				</td>
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
};
</script>

<style scoped>

</style>
