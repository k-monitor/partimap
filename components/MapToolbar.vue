<template>
	<div class="map-toolbar d-flex flex-column align-items-end">
		<div class="pl-2">
			<b-button-group
				class="shadow-sm"
				vertical
			>
				<b-button
					v-for="b in drawingButtons"
					:key="b.drawType"
					v-b-tooltip.hover.left
					:title="b.tooltip"
					:variant="b.variant"
					class="border border-secondary py-2"
					:class="!b.drawType ? 'cancel-button' : ''"
					@click="setDrawType(b.drawType)"
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
import { mapGetters, mapMutations } from 'vuex';
import { buttonFilter, buttons } from '../assets/toolbarUtil';

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
		...mapGetters(['getDrawType']),
		drawingButtons() {
			return buttons.filter(buttonFilter(this.getDrawType, this.sheet?.interactions, this.visitor));
		},
	},
	watch: {
		getDrawType(type) {
			const isDrawing = !!type;
			this.setSidebarVisible(!isDrawing);
		},
	},
	methods: {
		...mapMutations([
			'setDrawType',
			'setSidebarVisible',
		]),
	},
};
</script>

<style scoped>
.map-toolbar {
	position: absolute;
	right: 0;
	top: 0.5rem;
}

.btn {
	border-radius: 0.5rem;
	border-top-right-radius: 0px !important;
	border-bottom-right-radius: 0px !important;
	border-right-width: 0px !important;
	font-size: 1.25rem;
}

.sidebar-button {
	border-top-left-radius: 1.5rem;
	border-bottom-left-radius: 1.5rem;
}

.cancel-button {
	height: 126px;
}
</style>
