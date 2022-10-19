<template>
	<div>
		<td v-for="row in question.row" :key="row.id">
			<b-form-radio
				:value="row + ' ' + column"
				v-model="pickedRow"
				class="mb-3"
			></b-form-radio>
		</td>
		{{pickedRow}}
	</div>
</template>

<script>
export default {
	props: {
		column: {
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
