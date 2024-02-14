<template>
	<button
		class="list-group-item list-group-item-action align-items-center d-flex justify-content-between p-2 rounded"
		:style="{
			borderLeftWidth: '5px',
			borderLeftColor: color,
			opacity: isRated ? 0.6 : 1,
		}"
		@click="$emit('click')"
	>
		<span
			class="text-break"
			:class="{ 'font-weight-bold': isSelected }"
		>
			<i
				class="fas fa-fw mr-1"
				:class="icons[geometryType]"
			/>
			<i
				v-if="isHidden"
				class="fas fa-eye-slash fa-fw mr-1"
			/>
			{{ name }}
		</span>

		<span v-if="isSelected">
			<i class="fas fa-fw fa-times" />
		</span>

		<span
			v-if="isDeletable"
			class="ml-auto text-danger"
			role="button"
			@click.stop="$emit('delete')"
		>
			<i class="fas fa-fw fa-trash" />
		</span>

		<span v-if="isRated">
			<i class="fas fa-fw fa-check" />
		</span>

		<span
			v-if="rating"
			class="flex-shrink-0"
		>
			{{ rating }}
		</span>
	</button>
</template>

<script>
export default {
	props: {
		feature: {
			type: Object,
			required: true,
		},
		isDeletable: {
			type: Boolean,
			default: false,
		},
		isHidden: {
			type: Boolean,
			default: false,
		},
		isRated: {
			type: Boolean,
			default: false,
		},
		isSelected: {
			type: Boolean,
			default: false,
		},
		name: {
			type: String,
			default: null,
		},
		rating: {
			type: String,
			default: null,
		},
	},
	data() {
		return {
			color: this.feature.get('color'),
			geometryType: this.feature.getGeometry().getType(),
			icons: {
				Point: 'fa-map-marker-alt',
				LineString: 'fa-route',
				Polygon: 'fa-draw-polygon',
			},
		};
	},
	mounted() {
		this.$nuxt.$on('changeStyle', this.handleChangeStyle);
	},
	beforeDestroy() {
		this.$nuxt.$off('changeStyle', this.handleChangeStyle);
	},
	methods: {
		handleChangeStyle() {
			this.color = this.feature.get('color');
		},
	},
};
</script>
