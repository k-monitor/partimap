<script setup lang="ts">
import tinycolor from 'tinycolor2';

const props = defineProps<{
	interactions: Interactions | null;
}>();

const { currentDrawingInteraction, selectedFeatureId } = useStore();
const { featureCountByInteraction } = useVisitorData();

const drawingButtons = useDrawButtons(props.interactions);

function isDisabled(b: DrawingButton) {
	if (selectedFeatureId.value) return true;
	const id = b.drawingInteraction?.id || '';
	const count = featureCountByInteraction.value[id];
	const max = b.drawingInteraction?.max || Number.MAX_SAFE_INTEGER;
	return count >= max;
}

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
				<span
					class="fw-bold my-auto"
					:class="{ 'text-muted': isDisabled(b) }"
					>{{ b.tooltip }}</span
				>
			</div>
			<button
				class="btn border border-secondary py-2"
				:disabled="isDisabled(b)"
				:style="{
					backgroundColor: isDisabled(b) ? '#eee' : b.color,
					color: textColor(b),
					opacity: isDisabled(b) ? 0.5 : 1,
				}"
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
