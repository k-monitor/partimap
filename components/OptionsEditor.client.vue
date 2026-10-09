<script setup lang="ts">
const options = defineModel<QuestionOption[]>({ default: () => [] });

const {
	addButtonLabel,
	enableImages = false,
	label,
	readonly = false,
} = defineProps<{
	addButtonLabel: string;
	enableImages?: boolean;
	label: string;
	readonly?: boolean;
}>();

const { t } = useI18n();

const formGroupRef = useTemplateRef('formGroupRef');

function getLabel(i: number): string {
	return optionLabel(options.value[i]);
}

function setLabel(i: number, val: string) {
	const o = options.value[i];
	options.value[i] = typeof o === 'string' ? val : { ...o, label: val };
}

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
	if (getLabel(i) === defaultOption(i)) {
		setLabel(i, '');
	}
}

function handleInputBlur(i: number) {
	if (!getLabel(i)) {
		setLabel(i, defaultOption(i));
	}
}

const { errorToast } = useToasts();

function addImageToOption(i: number) {
	const o = options.value[i];
	const input = document.createElement('input');
	input.type = 'file';
	input.accept = 'image/jpeg,image/gif,image/png,image/webp';
	input.onchange = () => {
		const file = input.files?.[0];
		if (!file) return;
		if (file.size > 500 * 1024) {
			errorToast(t('tiptap.imgSizeLimit'));
			return;
		}
		const reader = new FileReader();
		reader.onload = (e) => {
			const src = e.target?.result as string;
			if (typeof o === 'string') {
				options.value[i] = { label: o, image: src };
			} else {
				options.value[i] = { ...o, image: src };
			}
		};
		reader.readAsDataURL(file);
	};
	input.click();
}

function removeImageFromOption(i: number) {
	const o = options.value[i];
	if (typeof o !== 'string' && o.image) {
		options.value[i] = { ...o, image: '' };
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
						<template v-if="enableImages">
							<b-button
								:class="{ 'p-0': typeof o !== 'string' && o.image }"
								:disabled="readonly"
								variant="outline-primary"
								@click="addImageToOption(i)"
							>
								<i
									v-if="typeof o === 'string' || !o.image"
									class="fas fa-fw fa-image"
								/>
								<img
									v-else
									:src="o.image"
									style="
										--size: 48px;
										height: var(--size);
										width: var(--size);
										object-fit: contain;
									"
								/>
							</b-button>
							<b-button
								v-if="typeof o !== 'string' && o.image"
								:disabled="readonly"
								size="sm"
								variant="outline-danger"
								@click="removeImageFromOption(i)"
							>
								<i class="fas fa-fw fa-xmark" />
							</b-button>
						</template>
					</template>
					<b-form-input
						:model-value="getLabel(i)"
						:readonly="readonly"
						:disabled="readonly"
						@update:model-value="setLabel(i, $event as string)"
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
