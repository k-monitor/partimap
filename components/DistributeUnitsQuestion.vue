<template>
	<div class="d-flex flex-column">
		<div
			v-for="o in question.options"
			:key="o"
			class="border-bottom d-flex mb-1 pb-1"
		>
			<div class="d-flex flex-grow-1 align-items-center">{{ o }}</div>
			<div class="d-flex flex-shrink-0 align-items-center py-1">
				<b-button
					:disabled="inputValues[o] === 0"
					size="sm"
					variant="light"
					@click="decrease(o)"
				>
					<i class="fas fa-fw fa-minus text-primary" />
				</b-button>
				<input
					v-model.number="inputValues[o]"
					class="form-control form-control-sm mx-1 text-center"
					:max="max"
					:min="0"
					style="width: 4rem"
					@input="handleChange(o, $event.target.value)"
				/>
				<b-button
					:disabled="sum >= max"
					size="sm"
					variant="light"
					@click="increase(o)"
				>
					<i class="fas fa-fw fa-plus text-primary" />
				</b-button>
			</div>
		</div>
		<div class="d-flex justify-content-end">
			<input
				v-if="question.required || sum !== 0"
				required
				:max="max"
				:min="max"
				type="number"
				:value="sum"
				style="opacity: 0; width: 1px"
			/>
			<div
				class="d-flex flex-shrink-0 align-items-center py-1 font-weight-bold"
				:class="{
					'text-muted': 0 === sum,
					'text-danger': sum !== max,
					'text-success': sum === max,
				}"
			>
				{{ sum }} / {{ max }}
			</div>
		</div>
		<p>{{ JSON.stringify(inputValues) }}</p>
		<p>{{ JSON.stringify(actualValues) }}</p>
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
			inputValues: {},
		};
	},
	computed: {
		max() {
			return this.question.max || 100;
		},
		actualValues() {
			const av = {};
			this.question.options.forEach(o => {
				av[o] = Number.parseInt(this.inputValues[o], 10) || 0;
			});
			return av;
		},
		sum() {
			return Object.values(this.actualValues).reduce((a, b) => a + b, 0);
		},
	},
	watch: {
		value() {
			this.initInputValues();
		},
		sum() {
			this.$emit('input', this.actualValues);
		},
	},
	mounted() {
		this.initInputValues();
	},
	methods: {
		initInputValues() {
			const iv = {};
			this.question.options.forEach(o => {
				const rv = (this.value || {})[o];
				const cv = Number.parseInt(rv, 10);
				iv[o] = Number.isInteger(cv) ? cv : null;
			});
			this.inputValues = iv;
		},
		increase(o) {
			if (this.sum >= this.max) return;
			this.inputValues[o] = (this.inputValues[o] || 0) + 1;
		},
		decrease(o) {
			this.inputValues[o] = Math.max((this.inputValues[o] || 0) - 1, 0);
		},
		handleChange(o) {
			if (this.sum > this.max) {
				const excess = Math.max(this.sum - this.max, 0);
				this.inputValues[o] = Math.max(this.inputValues[o] - excess, 0);
			} else if (this.inputValues[o] < 0) {
				this.inputValues[o] = null;
			}
		},
	},
};
</script>
