<script setup lang="ts">
defineProps<{
	description?: string;
	label?: string;
}>();
</script>

<template>
	<fieldset class="form-group">
		<legend
			v-if="label"
			class="form-label col-form-label pt-0"
		>
			{{ label }}
		</legend>
		<slot name="label" />
		<slot />
		<small
			v-if="description"
			class="form-text text-body-secondary"
		>
			{{ description }}
		</small>
	</fieldset>
</template>
