<script setup lang="ts">
const props = defineProps<{
	interactions: Interactions | null;
}>();

const { currentDrawingInteraction, selectedFeatureId } = useStore();

const drawingButtons = useDrawButtons(true, props.interactions);
</script>

<template>
	<div class="my-4">
		<div
			v-for="b in drawingButtons"
			:key="b.drawingInteraction?.id || b.drawType || 'cancel'"
			class="d-flex mb-3"
		>
			<div class="d-flex flex-grow-1">
				<span class="fw-bold my-auto">{{ b.tooltip }}</span>
			</div>
			<button
				class="btn py-2"
				:class="[!b.drawType ? 'cancel-button' : '', `btn-${b.variant}`]"
				:disabled="!!selectedFeatureId"
				type="button"
				@click="currentDrawingInteraction = b.drawingInteraction"
			>
				<i
					class="fas fa-fw"
					:class="b.icon"
				/>
			</button>
		</div>
	</div>
</template>
