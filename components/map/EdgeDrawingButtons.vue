<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		interactions?: Interactions | null;
		side: 'left' | 'right';
	}>(),
	{
		interactions: null,
	},
);

const drawingButtons = useDrawButtons(props.interactions);
</script>

<template>
	<div
		class="map-toolbar align-items-end d-flex flex-column position-absolute"
		:class="props.side"
		style="z-index: 1"
	>
		<div class="d-flex flex-column shadow-sm">
			<EdgeDrawingButton
				v-for="(b, i) in drawingButtons"
				:key="b.drawingInteraction?.id || 'cancel'"
				:options="b"
				:first="i === 0"
				:last="i === drawingButtons.length - 1"
				:side="side"
				:visitor="interactions !== null"
			/>
		</div>
	</div>
</template>

<style scoped>
.map-toolbar.left {
	left: 0;
	top: 5rem;
}

.map-toolbar.right {
	right: 0;
	top: 0.5rem;
}
</style>
