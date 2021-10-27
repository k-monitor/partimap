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
					:key="b.drawType"
					v-b-tooltip.hover.left
					:disabled="b.disabled"
					:title="b.tooltip"
					:variant="b.variant"
					class="border border-secondary py-2"
					___click="toggleEditState(b.drawType)"
				>
					<i
						class="fas fa-fw"
						:class="b.icon"
					/>
				</b-button>
			</b-button-group>
		</div>
	</div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
	props: {
		sheet: {
			type: Object,
			default: null,
		},
		visitor: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		drawingButtons() {
			return [
				this.db('Point', false, 'fa-map-marker-alt', 'Pont', 'danger'),
				this.db('LineString', false, 'fa-route', 'Vonal', 'primary'),
				this.db('Polygon', false, 'fa-draw-polygon', 'Terület', 'success'),
				this.db('', false, 'fa-times py-4', 'Mégsem', 'warning'),
			].filter(b => b); // removing hidden buttons
		},
	},
	methods: {
		...mapMutations(['toggleEditState', 'toggleSidebarVisible']),
		db(drawType, disabled, icon, tooltip, variant) {
			// TODO calculate disabled by itself, not from argument
			// TODO return null if button should be hidden
			return { drawType, disabled, icon, tooltip, variant };
		},
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
