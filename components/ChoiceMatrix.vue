<template>
	<div class="overflow-auto">
		<div class="matrix border-collapse d-table text-center">
			<div class="d-table-row">
				<div class="d-table-cell" />
				<div v-for="column in question.columns" :key="column" class="align-middle d-table-cell p-1 small text-break">
					{{ column }}
				</div>
			</div>
			<MatrixRows
				v-for="row in question.rows"
				:key="row"
				v-model="selected[row]"
				:question="question"
				:row="row"
			/>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: Object,
			default: () => {},
		},
		question: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			selected: this.value || {},
		};
	},
	watch: {
		selected: {
			handler(a) {
				this.$emit('input', a);
			},
			deep: true,
		},
	},
};
</script>

<style>
.border-collapse {
	border-collapse: collapse;
}

.matrix .d-table-cell {
	min-width: 90px;
	max-width: 90px;
}
</style>
