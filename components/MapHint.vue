<template>
	<div
		v-if="hint"
		class="map-hint alert alert-success border-success border-left-0 font-weight-bold m-0 shadow-sm"
	>
		{{ hint }}
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
				LineString: 'A vonalakat kattintással kell kijelölni, rajzolás közben az egeret nem kell nyomva tartani. A vonalat dupla kattintással kell bezárni.',
				Polygon: 'A terület pontjait kattintással kell kijelölni, rajzolás közben az egeret nem kell nyomva tartani. A területet a kezdőpontra való újbóli kattintással kell lezárni.'
			}[this.getDrawType];
		},
	},
};
</script>

<style scoped>
.map-hint {
	border-bottom-left-radius: 0;
	border-top-left-radius: 0;
	bottom: 2rem;
	max-width: 75%;
	left: 0;
	position: absolute;
}

@media screen and (max-width: 767.98px) {
	/* BS v4 sm */
	.map-hint {
		font-size: 85%;
	}
}
</style>
