<script setup lang="ts">
const props = defineProps<{
	backgroundImageUrl?: string | null;
}>();

const style = computed(() =>
	props.backgroundImageUrl ? { backgroundImage: `url(${props.backgroundImageUrl})` } : null,
);
</script>

<template>
	<div
		class="d-flex h-100 position-relative sheet"
		:style="style"
	>
		<slot />
	</div>
</template>

<style>
.sheet {
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
}
</style>
