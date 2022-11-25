<template>
	<div>
		<div
			v-for="b in drawingButtons"
			:key="b.drawType"
			class="d-flex mb-3"
		>
			<div class="d-flex flex-grow-1">
				<span class="my-auto">{{ b.tooltip }}</span>
			</div>
			<b-button
				:variant="b.variant"
				class="py-2"
				:class="!b.drawType ? 'cancel-button' : ''"
				@click="setDrawType(b.drawType)"
			>
				<i
					class="fas fa-fw"
					:class="b.icon"
				/>
			</b-button>
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
			default: true,
		},
	},

	computed: {
		...mapGetters(['getDrawType']),
		drawingButtons() {
			return buttons.filter(buttonFilter(this.getDrawType, this.sheet.interactions, this.visitor));
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
