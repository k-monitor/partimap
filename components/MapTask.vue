<script setup lang="ts">
import tinycolor from 'tinycolor2';

const { currentDrawingInteraction } = useStore();

const backgroundColor = computed(() => currentDrawingInteraction.value?.color || '#000000');
const textColor = computed(() =>
	tinycolor(backgroundColor.value).isLight() ? '#000000' : '#ffffff',
);

const task = computed(() => currentDrawingInteraction.value?.buttonLabel || '');
</script>

<template>
	<div
		v-if="task"
		class="map-task-container position-absolute text-center w-100"
	>
		<div
			class="map-task d-inline-block fw-bold m-0 px-3 py-2 rounded shadow-sm"
			:style="{ backgroundColor, color: textColor }"
		>
			{{ task }}
		</div>
	</div>
</template>

<style scoped>
.map-task-container {
	top: 2rem;
	padding: 0 75px;
}

@media screen and (max-width: 767.98px) {
	/* BS v4 sm */
	.map-task {
		font-size: 85%;
	}
}
</style>
