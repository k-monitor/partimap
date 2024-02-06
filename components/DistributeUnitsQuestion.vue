<template>
	<div class="d-flex flex-column">
		<div
			v-for="o in question.options"
			:key="o"
			class="d-flex"
		>
			<div class="d-flex flex-grow-1 align-items-center">{{ o }}</div>
			<div class="d-flex flex-shrink-0 align-items-center py-1">
				<b-button
					:disabled="innerValue[0] === 0"
					size="sm"
					variant="primary"
					@click="decrease(o)"
				>
					<i class="fas fa-fw fa-minus" />
				</b-button>
				<input
					v-model.number="innerValue[o]"
					class="form-control form-control-sm mx-1 text-center"
					:max="max"
					:min="0"
					style="width: 4rem"
					@input="handleChange(o, $event.target.value)"
				/>
				<b-button
					:disabled="sum >= max"
					size="sm"
					variant="primary"
					@click="increase(o)"
				>
					<i class="fas fa-fw fa-plus" />
				</b-button>
			</div>
		</div>
		<div class="d-flex justify-content-end">
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
		const innerValue = {};
		this.question.options.forEach(o => {
			innerValue[o] = (this.value || {})[o] || 0;
		});
		return {
			innerValue,
		};
	},
	computed: {
		max() {
			return this.question.max || 100;
		},
		sum() {
			return Object.values(this.innerValue).reduce((a, b) => a + b, 0);
		},
	},
	watch: {
		value(v) {
			const innerValue = v || {};
			this.question.options.forEach(o => {
				innerValue[o] = innerValue[o] || 0;
			});
			this.innerValue = innerValue;
		},
		innerValue: {
			handler(a) {
				this.$emit('input', a);
			},
			deep: true,
		},
	},
	methods: {
		increase(o) {
			if (this.sum >= this.max) return;
			this.innerValue[o] = (this.innerValue[o] || 0) + 1;
			// this.$emit('input', this.innerValue);
		},
		decrease(o) {
			this.innerValue[o] = Math.max((this.innerValue[o] || 0) - 1, 0);
			// this.$emit('input', this.innerValue);
		},
		handleChange(o) {
			if (this.sum > this.max) {
				const excess = this.sum - this.max;
				this.innerValue[o] = Math.max(this.innerValue[o] - excess, 0);
			}
			// this.$emit('input', this.innerValue);
		},
	},
};
</script>
