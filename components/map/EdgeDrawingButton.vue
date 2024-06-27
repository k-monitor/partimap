<script setup lang="ts">
import tinycolor from 'tinycolor2';

const { currentDrawingInteraction } = useStore();

const props = defineProps<{
	first?: boolean;
	last?: boolean;
	options: DrawingButton;
	side: 'left' | 'right';
}>();

const borderStyle = computed(() => {
	if (props.side === 'right') {
		return { borderRightWidth: '0 !important' };
	} else {
		return { borderLeftWidth: '0 !important' };
	}
});

const textColor = computed(() =>
	tinycolor(props.options.color).isLight() ? '#000000' : '#ffffff',
);

const tooltipOptions = computed(() => {
	const placement = props.side === 'right' ? 'left' : 'right';
	return { placement };
});
</script>

<template>
	<button
		v-b-tooltip.hover="{ ...tooltipOptions }"
		class="btn border border-secondary rounded-0 py-2"
		:class="[{ first, last }, side]"
		style="font-size: 1.25rem"
		:style="{
			backgroundColor: options.color,
			...borderStyle,
			color: textColor,
			height: options.drawingInteraction ? null : '140px',
		}"
		:title="options.tooltip"
		@click="currentDrawingInteraction = options.drawingInteraction"
	>
		<i
			class="fas fa-fw"
			:class="options.icon"
		/>
	</button>
</template>

<style scoped>
button:not(.first) {
	border-top-width: 0 !important;
}

button.first.left {
	border-top-right-radius: 0.5rem !important;
}

button.first.right {
	border-top-left-radius: 0.5rem !important;
}

button.last.left {
	border-bottom-right-radius: 0.5rem !important;
}

button.last.right {
	border-bottom-left-radius: 0.5rem !important;
}
</style>
