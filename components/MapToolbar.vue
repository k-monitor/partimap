<template>
	<div class="map-toolbar d-flex flex-column align-items-end">
		<b-button
			class="border border-secondary mb-2 p-3 pl-4 shadow-sm"
			size="lg"
			variant="light"
			@click="toggleSidebarVisible"
		>
			<i class="fas fa-fw fa-info" />
		</b-button>
		<div class="pl-2">
			<b-button-group
				class="shadow-sm"
				vertical
			>
				<b-button
					v-for="b in drawingButtons"
					:key="b.tooltip"
					v-b-tooltip.hover.left
					:disabled="b.disabled"
					:title="b.tooltip"
					:variant="b.variant"
					class="border border-secondary py-2"
				>
					<i class="fas fa-fw" :class="b.icon" />
				</b-button>
				<!--<b-button
					class="border border-secondary py-2"
					variant="danger"
				>
					<i class="fas fa-fw fa-map-marker-alt" />
				</b-button>
				<b-button
					class="border border-secondary py-2"
					variant="primary"
				>
					<i class="fas fa-fw fa-route" />
				</b-button>
				<b-button
					class="border border-secondary py-2"
					variant="success"
				>
					<i class="fas fa-fw fa-draw-polygon" />
				</b-button>-->
			</b-button-group>
		</div>
	</div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
	computed: {
		drawingButtons() {
			function b(disabled, icon, tooltip, variant) {
				return { disabled, icon, tooltip, variant };
			}

			return [
				b(false, 'fa-map-marker-alt', 'Pont', 'danger'),
				b(false, 'fa-route', 'Vonal', 'primary'),
				b(false, 'fa-draw-polygon', 'Terület', 'success'),
			];
		},
	},
	methods: {
		...mapMutations(['toggleSidebarVisible']),
	},
};
</script>

<style scoped>
.map-toolbar {
	position: absolute;
	right: 0;
	top: 2rem;
}

.btn {
	border-top-right-radius: 0px !important;
	border-bottom-right-radius: 0px !important;
}

.map-toolbar > .btn {
	border-top-left-radius: 1.5rem;
	border-bottom-left-radius: 1.5rem;
}
</style>
