<template>
	<button
		class="list-group-item list-group-item-action align-items-center d-flex justify-content-between p-2 rounded"
		:style="{
			borderLeftWidth: '5px',
			borderLeftColor: color,
			opacity: !isSelected && !showResult && isRated ? 0.6 : 1,
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
				v-if="hidden"
				class="fas fa-eye-slash fa-fw mr-1"
			/>
			{{ nonEmptyName }}
		</span>

		<span v-if="isSelected">
			<i class="fas fa-fw fa-times" />
		</span>
		<template v-else>
			<span
				v-if="isDeletable"
				class="ml-auto text-danger"
				role="button"
				@click.stop="$emit('delete')"
			>
				<i class="fas fa-fw fa-trash" />
			</span>

			<span
				v-if="showResult && ratingResult"
				class="flex-shrink-0"
			>
				{{ ratingResult }}
			</span>
			<span v-else-if="isRated">
				<i class="fas fa-fw fa-check" />
			</span>
		</template>
	</button>
</template>

<script>
export default {
	inject: ['feature'],
	props: {
		isDeletable: {
			type: Boolean,
			default: false,
		},
		isSelected: {
			type: Boolean,
			default: false,
		},
		ratingResult: {
			type: String,
			default: null,
		},
		showResult: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			color: this.feature.get('color'),
			geometryType: this.feature.getGeometry().getType(),
			hidden: this.feature.get('hidden') || false,
			icons: {
				Point: 'fa-map-marker-alt',
				LineString: 'fa-route',
				Polygon: 'fa-draw-polygon',
			},
			name: this.feature.get('name'),
			rating: this.feature.get('rating'),
		};
	},
	computed: {
		isRated() {
			const r = this.rating;
			return Number.isInteger(r) && r !== 0;
		},
		nonEmptyName() {
			const anon = this.$t('FeatureListElement.defaultName')[
				this.feature.getGeometry().getType()
			];
			return this.name || anon;
		},
	},
	mounted() {
		this.$nuxt.$on('contentModified', this.handleContentModified);
	},
	beforeDestroy() {
		this.$nuxt.$off('contentModified', this.handleContentModified);
	},
	methods: {
		handleContentModified() {
			this.color = this.feature.get('color');
			this.hidden = this.feature.get('hidden') || false;
			this.name = this.feature.get('name');
			this.rating = this.feature.get('rating');
		},
	},
};
</script>
