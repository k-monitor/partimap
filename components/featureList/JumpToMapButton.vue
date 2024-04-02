<script setup lang="ts">
const { sidebarVisible } = useStore();
</script>

<template>
	<div class="d-sm-none text-center">
		<button
			class="btn btn-outline-primary"
			@click="sidebarVisible = false"
		>
			<i class="fas fa-map-marked-alt position-relative" />
			{{ $t('FeatureListElement.jumpToMap') }}
		</button>
	</div>
</template>
