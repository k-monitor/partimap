<template>
	<tbody>
		<td v-for="column in question.column" :key="column.id">
			<b-form-radio
				:value="[{ [row]: column }]"
				v-model="selected"
				class="mb-3"
			></b-form-radio>
		</td>
		{{selected}}
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
			type: String,
			default: () => '',
		},
		question: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			selected: [],
		};
	},
	watch: {
		selected() {
			this.$emit('input', this.selected);
		},
	},
};
</script>
