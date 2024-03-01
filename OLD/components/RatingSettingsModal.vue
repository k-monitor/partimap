<template>
	<b-modal
		id="Rating-modal"
		ref="modal"
		:cancel-title="$t('modals.cancel')"
		ok-variant="success"
		:title="$t(`sheetEditor.interactions.Rating`)"
		@ok="handleOk"
		@show="reinit"
	>
		<div class="row">
			<b-form-group
				class="col-lg-6"
				:label="$t('sheetEditor.ratingType')"
			>
				<b-form-radio-group
					v-model="ratingType"
					:options="ratingTypes"
					stacked
				/>
			</b-form-group>
			<b-form-group
				v-if="stars !== -2"
				class="col"
				:label="$t('sheetEditor.numberOfStars')"
				label-for="stars"
			>
				<b-form-input
					id="stars"
					v-model.number="stars"
					max="10"
					min="1"
					type="number"
				/>
			</b-form-group>
		</div>

		<b-form-group>
			<b-form-checkbox v-model="textRating">
				{{ $t('sheetEditor.textRating') }}
			</b-form-checkbox>
		</b-form-group>

		<b-form-group class="ml-4">
			<b-form-radio-group
				v-if="textRating"
				v-model="textRatingType"
				:options="textRatingTypes"
				stacked
			/>
		</b-form-group>

		<b-form-group
			v-if="ratingExplanation"
			class="ml-4"
			:label="$t('sheetEditor.ratingQuestion')"
		>
			<b-form-input
				v-model="ratingQuestion"
				:placeholder="$t('sheetEditor.defaultRatingQuestion')"
			/>
		</b-form-group>

		<b-form-group>
			<b-form-checkbox v-model="ratingResults">
				{{ $t('sheetEditor.interactions.RatingResults') }}
			</b-form-checkbox>
		</b-form-group>
	</b-modal>
</template>

<script>
export default {
	props: {
		interactions: {
			type: Object,
			default: null,
		},
	},
	data() {
		const ratingTypes = [
			{ value: 0, text: this.$t('sheetEditor.ratingTypes.stars') },
			{ value: 1, text: this.$t('sheetEditor.ratingTypes.likeDislike') },
		];
		const textRatingTypes = [
			{
				value: 0,
				text: this.$t('sheetEditor.interactions.RatingExplanation'),
			},
			{
				value: 1,
				text: this.$t('sheetEditor.interactions.RatingProsCons'),
			},
		];
		return {
			ratingQuestion: '',
			ratingResults: false,
			ratingType: 0,
			ratingTypes,
			stars: 5,
			textRating: false,
			textRatingType: -1,
			textRatingTypes,
		};
	},
	computed: {
		ratingExplanation() {
			return this.textRatingType === 0;
		},
		ratingProsCons() {
			return this.textRatingType === 1;
		},
	},
	watch: {
		interactions: {
			handler() {
				this.reinit();
			},
			deep: true,
		},
		ratingType(v) {
			this.stars = v === 1 ? -2 : 5;
		},
		textRating(v) {
			this.textRatingType = v ? 0 : -1;
		},
	},
	methods: {
		reinit() {
			this.ratingQuestion = this.interactions.ratingQuestion;
			this.ratingResults =
				this.interactions.enabled.includes('RatingResults');
			this.ratingType = this.interactions.stars === -2 ? 1 : 0;
			this.stars = this.interactions.stars || 5;
			this.textRating =
				this.interactions.enabled.includes('RatingExplanation') ||
				this.interactions.enabled.includes('RatingProsCons');
			if (this.textRating) {
				this.textRatingType = this.interactions.enabled.includes(
					'RatingProsCons'
				)
					? 1
					: 0;
			} else {
				this.textRatingType = -1;
			}
		},
		handleOk() {
			this.$emit(
				'modified',
				this.ratingExplanation,
				this.ratingProsCons,
				this.ratingQuestion,
				this.ratingResults,
				this.stars
			);
			this.$refs.modal.hide();
		},
	},
};
</script>
