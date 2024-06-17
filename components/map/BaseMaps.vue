<script setup lang="ts">
const { baseMapToShow } = useStore();
</script>

<template>
	<template
		v-for="bm in baseMaps"
		:key="bm.id"
	>
		<ol-tile-layer
			v-if="bm.id === 'osm'"
			:visible="bm.id === baseMapToShow"
		>
			<ol-source-osm />
		</ol-tile-layer>

		<ol-tile-layer
			v-for="xyzUrl in bm.xyzUrls || []"
			:key="xyzUrl"
			:visible="bm.id === baseMapToShow"
		>
			<ol-source-xyz
				:url="xyzUrl"
				:attributions="bm.attribution"
			/>
		</ol-tile-layer>
	</template>

	<ol-attribution-control
		collapsible
		:collapsed="false"
		label="&copy;"
	/>
</template>
