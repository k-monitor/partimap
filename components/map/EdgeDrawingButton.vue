<script setup lang="ts">
import tinycolor from 'tinycolor2';
import type { CSSProperties } from 'vue';

const { currentDrawingInteraction, selectedFeatureId } = useStore();
const { featureCountByInteraction } = useVisitorData();

const props = defineProps<{
	edge?: boolean;
	first?: boolean;
	last?: boolean;
	options: DrawingButton;
	side: 'left' | 'right';
	visitor: boolean;
}>();

const borderStyle = computed(() => {
	if (!props.edge) return {};

	const style: CSSProperties = {};

	// radius

	style.borderRadius = '0 !important';
	if (props.first) {
		if (props.side === 'left') {
			style.borderTopRightRadius = '0.5rem !important';
		} else {
			style.borderTopLeftRadius = '0.5rem !important';
		}
	}
	if (props.last) {
		if (props.side === 'left') {
			style.borderBottomRightRadius = '0.5rem !important';
		} else {
			style.borderBottomLeftRadius = '0.5rem !important';
		}
	}

	// width

	if (!props.first) {
		style.borderTopWidth = '0 !important';
	}
	if (props.side === 'right') {
		style.borderRightWidth = '0 !important';
	} else {
		style.borderLeftWidth = '0 !important';
	}

	return style;
});

const tooltipOptions = computed(() => {
	const placement = props.side === 'right' ? 'left' : 'right';
	return { placement };
});

const reachedMax = computed(() => {
	const id = props.options.drawingInteraction?.id || '';
	const count = featureCountByInteraction.value[id];
	const max = props.options.drawingInteraction?.max || Number.MAX_SAFE_INTEGER;
	return count >= max;
});

const disabled = computed(() => {
	if (!props.visitor) return false; // admin can start drawing anytime
	if (selectedFeatureId.value) return true;
	return reachedMax.value;
});

const backgroundColor = computed(() => (disabled.value ? '#eee' : props.options.color));
const textColor = computed(() =>
	tinycolor(backgroundColor.value).isLight() ? '#000000' : '#ffffff',
);
</script>

<template>
	<div
		v-b-tooltip.hover="{ ...tooltipOptions }"
		:title="reachedMax ? $t('EdgeDrawingButton.reachedMax') : ''"
	>
		<button
			v-b-tooltip.hover="{ ...tooltipOptions }"
			class="btn border border-secondary py-2"
			:disabled="disabled"
			:style="{
				backgroundColor: backgroundColor,
				...borderStyle,
				color: textColor,
				fontSize: edge ? '1.25rem' : '1rem',
				height: options.drawingInteraction ? 'auto' : '140px',
				opacity: disabled ? 0.5 : 1,
			}"
			:title="edge ? options.tooltip : undefined"
			@click="currentDrawingInteraction = options.drawingInteraction"
		>
			<i
				class="fas fa-fw"
				:class="options.icon"
			/>
		</button>
	</div>
</template>
