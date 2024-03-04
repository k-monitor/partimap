<template>
	<div>
		<div
			v-for="b in drawingButtons"
			:key="b.drawType"
			class="d-flex mb-3"
		>
			<div class="d-flex flex-grow-1">
				<span class="fw-bold my-auto">{{ b.tooltip }}</span>
			</div>
			<b-button
				:variant="b.variant"
				class="py-2"
				:class="!b.drawType ? 'cancel-button' : ''"
				:disabled="!!getSelectedFeature"
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
import { buttons } from '../assets/toolbarUtil';

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
		...mapGetters({ getSelectedFeature: 'selected/getSelectedFeature' }),
		drawingButtons() {
			return buttons(
				this.getDrawType,
				this.sheet?.interactions,
				this.visitor,
				this
			);
		},
	},
	methods: {
		...mapMutations(['setDrawType']),
	},
};
</script>
