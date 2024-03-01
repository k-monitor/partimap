<template>
	<div class="overflow-auto">
		<div class="matrix d-table small w-100">
			<div class="d-table-row">
				<div class="d-table-cell">&nbsp;</div>
				<div
					v-for="column in question.columns"
					:key="column"
					class="d-table-cell align-middle p-1 text-center"
				>
					{{ column }}
				</div>
			</div>
			<MatrixRow
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
		value(v) {
			this.selected = v || {};
		},
		selected: {
			handler(a) {
				if (Object.keys(a).length) {
					this.$emit('input', a);
				}
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
/*
.matrix .matrix-cell {
	flex: 1 1 auto;
	max-width: 90px;
	min-width: 68px;
}

.matrix .matrix-cell:first-of-type {
	max-width: unset;
	min-width: 90px;
}*/
</style>
