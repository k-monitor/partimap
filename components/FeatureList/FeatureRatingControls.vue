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

		<template v-if="ratingValue">
			<template v-if="interactions.enabled.includes('RatingExplanation')">
				<b-form-group :label="interactions.ratingQuestion">
					<b-textarea
						v-model="ratingAnswers.answer"
						size="sm"
					/>
				</b-form-group>
			</template>
			<template
				v-else-if="interactions.enabled.includes('RatingProsCons')"
			>
				<b-form-group>
					<template #label>
						<span class="text-success">
							<i class="fas fa-fw fa-thumbs-up mr-1" />
							{{ $t('FeatureRatingControls.pros') }}
						</span>
					</template>
					<b-textarea
						v-model="ratingAnswers.pros"
						size="sm"
					/>
				</b-form-group>
				<b-form-group>
					<template #label>
						<span class="text-danger">
							<i
								class="fas fa-fw fa-thumbs-up fa-flip-both mr-1"
							/>
							{{ $t('FeatureRatingControls.cons') }}
						</span>
					</template>
					<b-textarea
						v-model="ratingAnswers.cons"
						size="sm"
					/>
				</b-form-group>
			</template>
		</template>
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
			ratingValue: undefined,
			ratingAnswers: {
				answer: undefined,
				pros: undefined,
				cons: undefined,
			},
			// ^ initialized on mount
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
		ratingAnswers: {
			handler(newValue) {
				const ratingObj = this.getRatingObj();
				ratingObj.answer = newValue.answer;
				ratingObj.pros = newValue.pros;
				ratingObj.cons = newValue.cons;
				this.storeRating(ratingObj);
			},
			deep: true,
		},
	},
	mounted() {
		const ratingObj = this.getRatingObj();
		this.ratingValue = ratingObj.value;
		this.ratingAnswers.answer = ratingObj.answer;
		this.ratingAnswers.pros = ratingObj.pros;
		this.ratingAnswers.cons = ratingObj.cons;
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
