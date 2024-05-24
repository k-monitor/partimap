<script setup lang="ts">
const image = defineModel<File | File[] | null | undefined>();

defineProps<{
	imageState?: boolean | null | undefined;
}>();
</script>

<template>
	<b-form-file
		v-model="image"
		accept="image/jpeg, image/png, image/webp"
		:drop-placeholder="$t('imageUpload.dropzone')"
		:placeholder="$t('imageUpload.browse')"
		:state="imageState"
	/>
	<!-- FIXME ^ placeholder prop is not used -->
</template>
