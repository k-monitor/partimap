<template>
	<div v-if="hint" class="map-hint-container position-absolute text-center w-100">
		<div class="alert alert-info border-info d-inline-block font-weight-bold m-0 shadow-sm">
			{{ hint }}
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	computed: {
		...mapGetters(['getDrawType']),
		hint() {
			return {
				// Point: '',
				LineString: 'A vonal kezdetét és köztes pontjait kattintással kell kijelölni, majd dupla kattintással lezárni.',
				Polygon: 'A terület határpontjait kattintással kell kijelölni, majd a kezdőpontra való újbóli kattintással lezárni.'
			}[this.getDrawType];
		},
	},
};
</script>

<style scoped>
.map-hint-container {
	bottom: 2rem;
	padding: 0 75px;
}

@media screen and (max-width: 767.98px) {
	/* BS v4 sm */
	.map-hint {
		font-size: 85%;
	}
}
</style>
