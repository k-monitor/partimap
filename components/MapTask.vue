<script setup lang="ts">
const props = defineProps<{
	interactions: Interactions;
}>();

const { drawType } = useStore();

const bgClasses: Record<DrawType, string> = {
	'': '',
	Point: 'bg-danger',
	LineString: 'bg-primary',
	Polygon: 'bg-success',
};
const bgClass = computed(() => bgClasses[drawType.value]);

const task = computed(() => {
	try {
		return props.interactions.buttonLabels[drawType.value];
	} catch {
		return '';
	}
});
</script>

<template>
	<div
		v-if="task"
		class="map-task-container position-absolute text-center w-100"
	>
		<div
			class="map-task d-inline-block fw-bold m-0 px-3 py-2 rounded shadow-sm text-white"
			:class="bgClass"
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
