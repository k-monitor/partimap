<template>
	<div class="border d-flex font-weight-bold justify-content-center p-2">
		<VueStarRating
			v-model="rating"
			active-color="var(--brand)"
			:animate="!showResults"
			border-color="var(--brand)"
			:border-width="2"
			clearable
			inactive-color="#eee"
			:max-rating="interactions?.stars"
			:read-only="showResults"
			:round-start-rating="false"
			:show-rating="false"
			:star-size="20"
		/>
		<span
			v-if="showResults && aggregatedRating.count"
			class="ml-3"
		>
			{{ rating ? Number(rating).toFixed(1) : '-' }}
			(<small class="fas fa-user fa-fw" />
			{{ aggregatedRating.count || 0 }})
		</span>
	</div>
</template>

<script>
export default {
	inject: {
		aggregatedRating: {
			default: {},
		},
		interactions: {
			default: null,
		},
	},
	props: {
		showResults: {
			type: Boolean,
			default: false,
		},
		value: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			rating: 0,
		};
	},
	watch: {
		value() {
			this.updateDisplayedRating();
		},
		rating(newRating) {
			if (this.showResults) return;
			this.$emit('input', newRating);
		},
	},
	mounted() {
		this.updateDisplayedRating();
	},
	methods: {
		updateDisplayedRating() {
			this.rating = this.showResults
				? this.aggregatedRating.average
				: this.value || 0;
		},
	},
};
</script>
