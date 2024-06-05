<script setup lang="ts">
defineProps<{
	showDelete?: boolean;
	showSave?: boolean;
}>();

defineEmits<{
	(e: 'delete'): void;
	(e: 'save'): void;
}>();
</script>

<template>
	<div class="align-items-center d-flex">
		<button
			v-if="showDelete"
			class="btn btn-outline-danger"
			@click="$emit('delete')"
		>
			<i class="fas fa-fw fa-trash me-1" />
			{{ $t('FeatureListElement.deleteFeature') }}
		</button>
		<button
			v-if="showSave"
			class="btn btn-success ms-auto"
			@click="$emit('save')"
		>
			{{ $t('SaveButton.save') }}
		</button>
	</div>
</template>
