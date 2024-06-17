<script setup lang="ts">
const props = defineProps<{
	interactions: Interactions;
}>();

const { drawType } = useStore();

const { t } = useI18n();

const drawingButtons = computed(() =>
	generateDrawButtons(drawType.value, props.interactions, true, t),
);
</script>

<template>
	<div
		class="align-items-end d-flex flex-column position-absolute"
		style="top: 5rem; left: 0; z-index: 1"
	>
		<div class="d-flex flex-column shadow-sm">
			<button
				v-for="b in drawingButtons"
				:key="b.drawType"
				v-b-tooltip.hover.left
				class="btn border border-secondary border-start-0 rounded-0 py-2"
				:class="`btn-${b.variant}`"
				style="font-size: 1.25rem"
				:style="{ height: b.drawType ? null : '140px' }"
				:title="b.tooltip"
				@click="drawType = b.drawType"
			>
				<i
					class="fas fa-fw"
					:class="b.icon"
				/>
			</button>
		</div>
	</div>
</template>

<style scoped>
.btn:first-of-type {
	border-top-right-radius: 0.5rem !important;
}

.btn:last-of-type {
	border-bottom-right-radius: 0.5rem !important;
}

.btn:not(:first-of-type) {
	border-top-width: 0 !important;
}
</style>
