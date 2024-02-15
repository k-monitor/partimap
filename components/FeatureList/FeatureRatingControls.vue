<template>
	<div class="mb-3">
		<template v-if="interactions.stars === -2">
			<LikeDislikeRating
				v-model="rating"
				:show-results="showResults"
			/>
		</template>

		<input
			v-model.number="rating"
			type="number"
		/>
		<!--
				<b-button-group
					v-if="stars === -2"
					class="w-100"
				>

				</b-button-group>
				<div
					v-else
					class="border d-flex font-weight-bold justify-content-center p-1"
				>
					<StarRating
						v-model="rating"
						active-color="var(--brand)"
						:animate="visitor && !showResults"
						border-color="var(--brand)"
						:border-width="2"
						clearable
						inactive-color="#fff"
						:max-rating="stars"
						:read-only="!visitor || showResults"
						:round-start-rating="false"
						:show-rating="false"
						:star-size="16"
					/>
					<span
						v-if="!visitor || showResults"
						class="ml-2"
					>
						{{ rating ? Number(rating).toFixed(1) : '-' }}
						(<small class="fas fa-user fa-fw" />
						{{ initFeatureRating.count || 0 }})
					</span>
				</div> -->
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
