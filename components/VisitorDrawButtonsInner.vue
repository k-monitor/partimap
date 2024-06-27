<script setup lang="ts">
import tinycolor from 'tinycolor2';

const props = defineProps<{
	interactions: Interactions | null;
}>();

const { currentDrawingInteraction, selectedFeatureId } = useStore();

const drawingButtons = useDrawButtons(props.interactions);

function textColor(b: DrawingButton) {
	return tinycolor(b.color).isLight() ? '#000000' : '#ffffff';
}
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
			<button
				class="btn py-2"
				:class="!b.drawingInteraction ? 'cancel-button' : ''"
				:disabled="!!selectedFeatureId"
				:style="{ backgroundColor: b.color, color: textColor(b) }"
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
