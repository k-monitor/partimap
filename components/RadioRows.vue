<template>
	<tbody>
		<td v-for="column in question.column" :key="column.id">
			<b-form-radio
				:value="row + ' ' + column"
				v-model="pickedRow"
				class="mb-3"
			></b-form-radio>
		</td>
		{{pickedRow}}
	</tbody>
</template>

<script>
export default {
	props: {
		column: {
			type: Array,
			default: () => [],
		},
		row: {
			type: Array,
			default: () => [],
		},
		question: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			pickedRow: [],
		};
	},
};
</script>
