<script setup lang="ts">
const options = defineModel<QuestionOption[]>({ default: () => [] });

const { addButtonLabel, label, readonly = false } = defineProps<{
	addButtonLabel: string;
	label: string;
	readonly?: boolean;
}>();

const { t } = useI18n();

const formGroupRef = useTemplateRef('formGroupRef');

async function addOption() {
	options.value = [
		...options.value,
		t('OptionsEditor.optionPrefix') + ` #${options.value.length + 1}`,
	];

	if (!formGroupRef.value) return;
	await nextTick();
	const inputs = formGroupRef.value.$el.querySelectorAll('input');
	if (inputs.length > 0) {
		inputs[inputs.length - 1].focus();
	}
}

function delOption(i: number) {
	options.value.splice(i, 1);
}

function defaultOption(i: number) {
	return t('OptionsEditor.optionPrefix') + ` #${i + 1}`;
}

function handleInputFocus(i: number) {
	if (options.value[i] === defaultOption(i)) {
		options.value[i] = '';
	}
}

function handleInputBlur(i: number) {
	if (!options.value[i]) {
		options.value[i] = defaultOption(i);
	}
}
</script>

<template>
	<div>
		<b-form-group
			ref="formGroupRef"
			:label="label"
		>
			<draggable
				v-model="options"
				animation="200"
				handle=".handle"
			>
				<b-input-group
					v-for="(o, i) in options || []"
					:key="i"
					class="mb-2"
				>
					<template #prepend>
						<div class="handle d-flex flex-shrink-0 align-items-center px-2 bg-light">
							<i class="fas fa-grip-vertical" />
						</div>
					</template>
					<b-form-input
						v-model="options[i]"
						:readonly="readonly"
						:disabled="readonly"
						@focus="handleInputFocus(i)"
						@blur="handleInputBlur(i)"
						@keyup.enter="addOption"
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
			</draggable>
			<b-button
				v-if="!readonly"
				variant="success"
				@click="addOption"
			>
				{{ addButtonLabel }}
			</b-button>
		</b-form-group>
	</div>
</template>
