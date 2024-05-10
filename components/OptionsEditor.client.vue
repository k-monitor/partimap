<script setup lang="ts">
const options = defineModel<string[]>({ default: [] });

const props = withDefaults(
	defineProps<{
		labelState?: 'row' | 'column' | 'option';
		readonly?: boolean;
	}>(),
	{
		labelState: 'option',
		readonly: false,
	},
);

const { t } = useI18n();

const label = computed(() => t(`OptionsEditor.${props.labelState}s`));

const labelButton = computed(() => {
	const str = props.labelState;
	const cap = str.charAt(0).toUpperCase() + str.slice(1);
	return t(`OptionsEditor.add${cap}`);
});

function addOption() {
	options.value.push(t('OptionsEditor.optionPrefix') + ` #${options.value.length + 1}`);
}

function delOption(i: number) {
	options.value.splice(i, 1);
}
</script>

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
