<script setup lang="ts">
defineProps<{
	contentModified: boolean;
}>();

defineEmits<{
	(e: 'save'): void;
}>();
</script>

<template>
	<button
		class="btn"
		:class="contentModified ? 'btn-success' : 'btn-outline-success'"
		:disabled="!contentModified"
		@click="$emit('save')"
	>
		<i
			class="fas fa-fw me-1"
			:class="!contentModified ? 'fa-check' : 'fa-save'"
		/>
		<span>{{ !contentModified ? $t('SaveButton.saved') : $t('SaveButton.save') }}</span>
	</button>
</template>
