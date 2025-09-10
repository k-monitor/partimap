<script setup lang="ts">
defineProps<{
	name: string;
	required: boolean;
}>();

const value = defineModel<string>({ default: '' });
</script>

<template>
	<b-form-textarea
		v-model="value"
		:name="name"
		:required="required"
		rows="3"
		max-rows="6"
		@blur="value = value.trim()"
	/>
</template>
