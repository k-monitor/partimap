<template>
	<div>
		<label>
			{{ label }}
		</label>
		<b-form-group>
			<b-input-group
				v-for="(o, i) in options || []"
				:key="i"
				class="mb-2"
			>
				<b-form-input
					v-model="options[i]"
					:readonly="readonly"
					:disabled="readonly"
				/>
				<template #append>
					<b-button
						v-if="!readonly"
						variant="outline-danger"
						@click="delOption(i)"
					>
						<i class="fas fa-fw fa-trash" />
					</b-button>
				</template>
			</b-input-group>
			<b-button
				v-if="!readonly"
				variant="success"
				@click="addOption"
			>
				{{ labelButton }}
			</b-button>
		</b-form-group>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: Array,
			default: () => [],
		},
		readonly: {
			type: Boolean,
			default: false,
		},
		labelState: {
			type: String,
			default: () => '',
		},
	},
	data() {
		return {
			options: this.value,
		};
	},
	computed: {
		label() {
			if (this.labelState === 'row') {
				return this.$t('OptionsEditor.rows');
			}
			if (this.labelState === 'column') {
				return this.$t('OptionsEditor.columns');
			}
			return this.$t('OptionsEditor.options');
		},
		labelButton() {
			if (this.labelState === 'row') {
				return this.$t('OptionsEditor.addRow');
			}
			if (this.labelState === 'column') {
				return this.$t('OptionsEditor.addColumn');
			}
			return this.$t('OptionsEditor.addOption');
		},
	},
	watch: {
		options() {
			this.$emit('input', this.options);
		},
	},
	methods: {
		addOption() {
			if (!this.options) {
				this.options = [];
			}
			this.options.push(
				this.$t('OptionsEditor.optionPrefix') +
					` #${this.options.length + 1}`
			);
		},
		delOption(i) {
			this.options.splice(i, 1);
		},
	},
};
</script>
