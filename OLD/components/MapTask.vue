<template>
	<div
		v-if="task"
		class="map-task-container position-absolute text-center w-100"
	>
		<div
			class="map-task d-inline-block font-weight-bold m-0 px-3 py-2 rounded shadow-sm text-white"
			:class="bgClass"
		>
			{{ task }}
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	props: {
		interactions: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		...mapGetters(['getDrawType']),
		bgClass() {
			const bgClasses = {
				Point: 'bg-danger',
				LineString: 'bg-primary',
				Polygon: 'bg-success',
			};
			return bgClasses[this.getDrawType];
		},
		task() {
			try {
				return this.interactions.buttonLabels[this.getDrawType];
			} catch {
				return '';
			}
		},
	},
};
</script>

<style scoped>
.map-task-container {
	top: 2rem;
	padding: 0 75px;
}

@media screen and (max-width: 767.98px) {
	/* BS v4 sm */
	.map-task {
		font-size: 85%;
	}
}
</style>
