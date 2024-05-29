<script setup lang="ts">
const image = defineModel<File | null | undefined>();

withDefaults(
	defineProps<{
		state: boolean | null;
	}>(),
	{
		state: null,
	},
);

const input = ref<HTMLInputElement>();

function handleChange(e: Event) {
	console.log('change called');
	const fileInputEl = e.target as HTMLInputElement;
	if (fileInputEl.files?.[0]) {
		image.value = fileInputEl.files[0];
	}
}

function handleDrop(e: DragEvent) {
	if (e.dataTransfer?.files && input.value) {
		console.log('e', e.dataTransfer.files);
		image.value = e.dataTransfer.files[0];
		console.log('i', image.value);
		nextTick(() => console.log('i2', image.value));
	}
	dropzoneActive.value = false;
}

const dropzoneActive = ref(false);

const { t } = useI18n();

const label = computed(() => {
	if (dropzoneActive.value) return t('imageUpload.dropzone');
	if (image.value) return image.value.name;
	return t('imageUpload.browse');
});
</script>

<template>
	<label
		class="form-control"
		:class="{
			'is-invalid': state === false,
			'is-valid': state,
		}"
		@dragover.prevent="dropzoneActive = true"
		@dragleave.prevent="dropzoneActive = false"
		@drop.prevent="handleDrop"
	>
		<span>{{ label }}</span>
		<input
			ref="input"
			accept="image/jpeg, image/png, image/webp"
			style="height: 0; width: 0; opacity: 0"
			type="file"
			@change="handleChange"
		/>
	</label>
</template>
