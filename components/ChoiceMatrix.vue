<template>
	<div class="overflow-auto">
		<div class="d-table border-collapse text-center my-table">
			<div class="d-table-row font-weight-bold">
				<div>
					<div class="d-table-cell"></div>
					<div v-for="columns in question.column" :key="columns" class="d-table-cell text-break">
						{{ columns }}
					</div>
				</div>
			</div>
			<div v-for="rows in question.row" :key="rows" class="d-table-row border-top hover-row">
				<MatrixRows
					v-model="selected[rows]"
					:question="question"
					:row="rows"
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
