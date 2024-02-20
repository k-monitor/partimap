<template>
	<div
		class="d-flex flex-column"
		style="gap: 1rem"
	>
		<LikeDislikeRating
			v-if="interactions.stars === -2"
			v-model="ratingValue"
			:show-results="showResults"
		/>
		<StarRating
			v-else
			v-model="ratingValue"
			:show-results="showResults"
		/>

		<!-- <FeatureRatingExplanation
			v-if="interactions.enabled.includes('RatingExplanation')"
		/> -->
	</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
	inject: ['feature', 'interactions', 'sheet'],
	props: {
		showResults: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			ratingValue: undefined, // initialized on mount
		};
	},
	computed: {
		...mapGetters('visitordata', ['getVisitorRatings']),
		visitorCanRate() {
			return this.interactions?.enabled.includes('Rating');
		},
	},
	watch: {
		ratingValue(newValue) {
			const ratingObj = this.getRatingObj();
			ratingObj.value = newValue;
			this.storeRating(ratingObj);

			// update map and FLE header
			this.feature.set('rating', newValue);
			this.$nuxt.$emit('contentModified');
		},
	},
	mounted() {
		this.ratingValue = this.getRatingObj().value;
	},
	methods: {
		...mapMutations('visitordata', ['addRatings']),
		getRatingObj() {
			const ratings = this.getVisitorRatings(this.sheet.id) || {};
			return ratings[this.feature.getId()] || { value: undefined };
		},
		storeRating(ratingObj) {
			const ratings = this.getVisitorRatings(this.sheet.id) || {};
			const featureId = this.feature.getId();
			delete ratings[featureId];
			if (ratingObj.value) ratings[featureId] = ratingObj;
			this.addRatings({ ratings, sheetId: this.sheet.id });
		},
	},
};
</script>
