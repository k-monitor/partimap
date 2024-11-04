<script setup lang="ts">
defineProps<{
	show: boolean;
	text?: string;
}>();
</script>

<template>
	<b-overlay
		no-wrap
		opacity="0.75"
		:show="show"
	>
		<template #overlay>
			<div class="text-center">
				<BSpinner />
				<p v-if="text">{{ text }}</p>
			</div>
		</template>
	</b-overlay>
</template>

<style scoped>
.b-overlay-wrap {
	position: static !important;
}
</style>
