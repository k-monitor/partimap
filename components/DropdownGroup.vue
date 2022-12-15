<template>
	<div>
		<b-form-select
			v-model="selected"
			:options="options"
			:required="q.required"
		/>
		<div
			v-if="selected == other"
			class="mt-2"
		>
			<div class="d-flex">
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
import { OTHER_PREFIX } from '../assets/constants';

export default {
	props: {
		q: {
			type: Object,
			default: () => {},
		},
		value: {
			type: String,
			default: () => '',
		},
	},
	data() {
		return {
			selected: this.value.startsWith(OTHER_PREFIX) ? OTHER_PREFIX : this.value,
			otherValue: this.value.startsWith(OTHER_PREFIX)
				? this.value.slice(OTHER_PREFIX.length)
				: '',
			options: this.q.options,
			other: OTHER_PREFIX,
		};
	},
	computed: {
		answer() {
			return this.selected === this.other
				? this.other + this.otherValue
				: this.selected;
		},
	},
	watch: {
		answer() {
			this.$emit('input', this.answer);
		},
		selected(s) {
			if (s === this.other) {
				this.$nextTick(() => this.$refs.otherInput.focus());
			}
		},
	},
	mounted() {
		this.options = Object.assign({}, this.q.options);
		this.options = Object.keys(this.options)
			.slice(0, this.options.size)
			.map(key => ({ text: this.options[key], value: this.options[key] }));
		if (this.q.other) {
			this.options.push({ text: 'Egyéb...', value: this.other });
		}
	},
};
</script>
