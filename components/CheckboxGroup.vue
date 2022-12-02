<template>
	<div>
		<b-form-checkbox-group
			v-model="selected"
			:options="options"
			:required="q.required && (selected || []).length < 1"
			stacked
		/>
		<div
			v-if="otherSelected"
			class="mt-2"
		>
			<div class="d-flex pl-3">
				<div class="d-flex flex-column mx-3">
					<i class="fa fa-level-up-alt fa-rotate-90 m-auto" />
				</div>
				<b-form-input
					ref="otherInput"
					v-model="otherValue"
					:required="q.required"
				/>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		q: {
			type: Object,
			default: () => {},
		},
		value: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		const OTHER_PREFIX = 'other: '; // TODO move to a common file

		let otherValue = '';
		const selected = this.value.map(o => {
			if (o.startsWith(OTHER_PREFIX)) {
				otherValue = o.slice(OTHER_PREFIX.length);
				return OTHER_PREFIX;
			}
			return o;
		});

		return {
			options: [],
			otherValue,
			other: OTHER_PREFIX,
			selected,
		};
	},
	computed: {
		answer() {
			return this.selected.map(o => o === this.other
				? this.other + this.otherValue
				: o
			);
		},
		otherSelected() {
			return this.selected.filter(o => o.startsWith(this.other)).length;
		},
	},
	watch: {
		answer() {
			this.updateCheckboxStates();
			this.$emit('input', this.answer);
		},
		otherSelected(s) {
			if (s) {
				this.$nextTick(() => this.$refs.otherInput.focus());
			}
		},
	},
	mounted() {
		this.options = this.q.options.map(o => ({
			text: o,
			value: o,
			disabled: false,
		}));
		if (this.q.other) {
			this.options.push({
				text: 'Egyéb...',
				value: this.other,
				disabled: false,
			});
		}
		this.updateCheckboxStates();
	},
	methods: {
		updateCheckboxStates() {
			const max = this.q.max || this.options.length;
			if (this.selected.length >= max) {
				this.options.forEach(o => {
					if (!this.selected.includes(o.value)) {
						o.disabled = true;
					}
				});
			} else {
				this.options.map(item => (item.disabled = false));
			}
		},
	},
};
</script>
