<template>
	<div v-if="visitorCanRate">
		<h1>TESZT RATING</h1>
		<input
			v-model.number="rating"
			type="number"
		/>
	</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
	inject: ['feature', 'interactions', 'sheet'],
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
