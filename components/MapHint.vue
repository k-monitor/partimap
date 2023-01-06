<template>
	<div v-if="hint" class="map-hint-container position-absolute text-center w-100">
		<div class="bg-dark border border-secondary d-inline-block font-weight-bold m-0 px-3 py-2 rounded shadow-sm text-white">
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
			return this.$t('MapHint')[this.getDrawType] || '';
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
