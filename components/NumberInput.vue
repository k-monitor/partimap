<script setup lang="ts">
const props = defineProps<{
	modelValue?: number | null;
	modelModifiers?: { integer?: boolean };
	min?: number | string;
	max?: number | string;
	name?: string;
	required?: boolean;
}>();

const emit = defineEmits<{
	'update:modelValue': [value: number | null];
}>();

const isInteger = computed(() => !!props.modelModifiers?.integer);

function onUpdate(value: string | number) {
	const str = String(value);
	const parsed = isInteger.value ? parseInt(str, 10) : parseFloat(str);
	emit('update:modelValue', isNaN(parsed) ? null : parsed);
}

function onKeydown(e: KeyboardEvent) {
	if (
		isInteger.value &&
		e.key.length === 1 &&
		!['-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)
	) {
		e.preventDefault();
	}
}
</script>

<template>
	<b-form-input
		:value="modelValue"
		:min="min"
		:max="max"
		:name="name"
		:required="required"
		type="number"
		@update:model-value="onUpdate"
		@keydown="onKeydown"
	/>
</template>
