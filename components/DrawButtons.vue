<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		interactions: Interactions;
		visitor?: boolean;
	}>(),
	{ visitor: true },
);

const { drawType, selectedFeatureId } = useStore();

const { t } = useI18n();

const drawingButtons = computed(() =>
	generateDrawButtons(drawType.value, props.interactions, props.visitor, t),
);
</script>

<template>
	<div class="my-4">
		<div
			v-for="b in drawingButtons"
			:key="b.drawType"
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
