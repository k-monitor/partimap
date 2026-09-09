<script setup lang="ts">
defineProps<{
	description?: string;
	invalidFeedback?: string;
	label?: string;
}>();

const isInvalid = ref(false);
</script>

<template>
	<fieldset
		class="form-group"
		:class="{ 'is-invalid': isInvalid }"
		@invalid.capture="isInvalid = true"
		@input="isInvalid = false"
	>
		<legend
			v-if="label"
			class="form-label col-form-label pt-0"
		>
			{{ label }}
		</legend>
		<slot name="label" />
		<slot />
		<div
			v-if="isInvalid && invalidFeedback"
			class="invalid-feedback d-block"
		>
			{{ invalidFeedback }}
		</div>
		<small
			v-if="description"
			class="form-text text-body-secondary"
		>
			{{ description }}
		</small>
	</fieldset>
</template>
