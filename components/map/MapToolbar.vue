<script setup lang="ts">
const { t } = useI18n();
const { drawType } = useStore();

const interactions = inject<Ref<Interactions | null>>('interactions');

const props = defineProps<{
	visitor?: boolean;
}>();

const drawingButtons = computed(() =>
	generateDrawButtons(drawType.value, interactions?.value, props.visitor, t),
);
</script>

<template>
	<div
		class="align-items-end d-flex flex-column position-absolute"
		style="top: 0.5rem; right: 0; z-index: 1"
	>
		<div class="d-flex flex-column shadow-sm">
			<button
				v-for="b in drawingButtons"
				:key="b.drawType"
				v-b-tooltip.hover.left
				class="btn border border-secondary border-end-0 rounded-0 py-2"
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
	border-top-left-radius: 0.5rem !important;
}

.btn:last-of-type {
	border-bottom-left-radius: 0.5rem !important;
}

.btn:not(:first-of-type) {
	border-top-width: 0 !important;
}
</style>
