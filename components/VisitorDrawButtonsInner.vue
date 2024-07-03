<script setup lang="ts">
const props = defineProps<{
	interactions: Interactions | null;
}>();

const drawingButtons = useDrawButtons(props.interactions);
</script>

<template>
	<div class="my-4">
		<div
			v-for="b in drawingButtons"
			:key="b.drawingInteraction?.id || 'cancel'"
			class="d-flex mb-3"
		>
			<div class="d-flex flex-grow-1">
				<span class="fw-bold my-auto">{{ b.tooltip }}</span>
			</div>
			<EdgeDrawingButton
				:options="b"
				side="right"
				visitor
			/>
		</div>
	</div>
</template>
