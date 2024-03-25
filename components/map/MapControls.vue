<script setup lang="ts">
const { changeBaseMap } = useStore();

defineEmits<{
	(e: 'changeZoom', delta: number): void;
}>();
</script>

<template>
	<div
		class="position-absolute"
		style="bottom: 2rem; right: 0"
	>
		<div class="d-flex flex-column shadow-sm">
			<button
				v-b-tooltip.hover.left
				class="btn btn-dark border border-secondary border-end-0 border-bottom-0 rounded-0 py-2"
				style="font-size: 1.25rem; border-top-left-radius: 0.5rem !important"
				:title="$t('Map.changeBaseMap')"
				@click="changeBaseMap()"
			>
				<i class="fas fa-map" />
			</button>
			<button
				class="btn btn-dark border border-secondary border-end-0 rounded-0 py-2"
				style="font-size: 1.25rem"
				@click="$emit('changeZoom', 1)"
			>
				<i class="fas fa-fw fa-plus" />
			</button>
			<button
				class="btn btn-dark border border-secondary border-end-0 border-top-0 rounded-0 py-2"
				style="font-size: 1.25rem; border-bottom-left-radius: 0.5rem !important"
				@click="$emit('changeZoom', -1)"
			>
				<i class="fas fa-fw fa-minus" />
			</button>
		</div>
	</div>
</template>
