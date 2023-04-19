<template>
	<div class="overflow-auto">
		<div class="matrix text-center w-100">
			<div class="d-flex w-100">
				<div class="matrix-cell">&nbsp;</div>
				<div
					v-for="column in question.columns"
					:key="column"
					class="matrix-cell align-items-center d-flex justify-content-center p-1 small text-break"
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

.matrix .matrix-cell {
	flex: 1 1 auto;
	min-width: 90px;
	max-width: 90px;
}

.matrix .matrix-cell:first-of-type {
	max-width: unset;
}
</style>
