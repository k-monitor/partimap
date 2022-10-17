<template>
	<div>
		<table>
			<tr>
				<td>
				</td>
				<td v-for="item in question.row" :key="item.id">
					{{ item }}
				</td>
			</tr>
			<tr>
				<td>
					{{question.column[0]}}
				</td>
				<td v-for="item in question.row" :key="item.id">
					<b-form-radio
						:id="item.id"
						v-model="picked"
						class="mb-3"
					></b-form-radio>
				</td>
			</tr>
			<tr>
				<td>
					{{question.column[1]}}
				</td>
				<td v-for="item in question.row" :key="item.id">
					<b-form-radio
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
