<script setup lang="ts">
const { t, te } = useI18n();
const { drawType } = useStore();

const hint = computed(() => {
	const key = `MapHint.${drawType.value}`;
	return te(key) ? t(key) : '';
});
</script>

<template>
	<div
		v-if="hint"
		class="map-hint-container position-absolute text-center"
		style="bottom: 3rem; left: 1rem; right: 4.5rem; z-index: 1"
	>
		<div
			class="map-hint bg-dark border border-secondary d-inline-block fw-bold m-0 px-3 py-2 rounded shadow-sm text-white"
		>
			{{ hint }}
		</div>
	</div>
</template>

<style scoped>
@media screen and (max-width: 767.98px) {
	/* BS v4 sm */
	.map-hint {
		font-size: 85%;
	}
}
</style>
