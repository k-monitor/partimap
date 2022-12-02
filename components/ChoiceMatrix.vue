<template>
	<div class="overflow-auto">
		<div class="d-table border-collapse text-center my-table">
			<div class="d-table-row font-weight-bold">
				<div>
					<div class="d-table-cell" />
					<div v-for="column in question.columns" :key="column" class="d-table-cell text-break">
						{{ column }}
					</div>
				</div>
			</div>
			<div v-for="row in question.rows" :key="row" class="d-table-row border-top hover-row">
				<MatrixRows
					v-model="selected[row]"
					:question="question"
					:row="row"
				/>
			</div>
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

<style scoped>
.border-collapse {
	border-collapse: collapse;
}
.my-table .d-table-cell {
	min-width: 90px;
	max-width: 90px;
}
.hover-row:hover {background-color: rgb(227, 227, 227);}
</style>
