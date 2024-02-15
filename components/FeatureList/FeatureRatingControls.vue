<template>
	<LikeDislikeRating
		v-if="interactions.stars === -2"
		v-model="rating"
		:show-results="showResults"
	/>
	<StarRating
		v-else
		v-model="rating"
		:show-results="showResults"
	/>
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
			rating: this.feature.get('rating'),
		};
	},
	computed: {
		...mapGetters('visitordata', ['getVisitorRatings']),
		visitorCanRate() {
			return this.interactions?.enabled.includes('Rating');
		},
	},
	watch: {
		rating(newRating) {
			this.feature.set('rating', newRating);
			this.storeRating(newRating);
			this.$nuxt.$emit('contentModified');
		},
	},
	methods: {
		...mapMutations('visitordata', ['addRatings']),
		storeRating(newRating) {
			const featureId = this.feature.getId();
			const ratings = this.getVisitorRatings(this.sheet.id) || {};
			delete ratings[featureId];
			if (newRating) ratings[featureId] = newRating;
			this.addRatings({ ratings, sheetId: this.sheet.id });
		},
	},
};
</script>
