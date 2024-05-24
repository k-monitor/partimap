<script setup lang="ts">
const visible = defineModel<boolean>();

const props = defineProps<{
	interactions: Interactions;
}>();
const interactions = toRef(props, 'interactions');

const { t } = useI18n();

const ratingTypes = [
	{ value: 0, text: t('sheetEditor.ratingTypes.stars') },
	{ value: 1, text: t('sheetEditor.ratingTypes.likeDislike') },
];

const textRatingTypes = [
	{
		value: 0,
		text: t('sheetEditor.interactions.RatingExplanation'),
	},
	{
		value: 1,
		text: t('sheetEditor.interactions.RatingProsCons'),
	},
];

const ratingQuestion = ref('');
const ratingResults = ref(false);
const ratingType = ref(0);
const stars = ref(5);
const textRating = ref(false);
const textRatingType = ref(-1);

const ratingExplanation = computed(() => textRatingType.value === 0);
const ratingProsCons = computed(() => textRatingType.value === 1);

watch(ratingType, (v) => (stars.value = v === 1 ? -2 : 5));
watch(textRatingType, (v) => (textRatingType.value = v ? 0 : -1));

function reinit() {
	ratingQuestion.value = interactions.value.ratingQuestion;
	ratingResults.value = interactions.value.enabled.includes('RatingResults');
	ratingType.value = interactions.value.stars === -2 ? 1 : 0;
	stars.value = interactions.value.stars || 5;
	textRating.value =
		interactions.value.enabled.includes('RatingExplanation') ||
		interactions.value.enabled.includes('RatingProsCons');
	if (textRating.value) {
		textRatingType.value = interactions.value.enabled.includes('RatingProsCons') ? 1 : 0;
	} else {
		textRatingType.value = -1;
	}
}
watch(interactions, reinit, { deep: true });

const emit = defineEmits<{
	(
		e: 'modified',
		ratingExplanation: boolean,
		ratingProsCons: boolean,
		ratingQuestion: string,
		ratingResults: boolean,
		stars: number,
	): void;
}>();
function handleOk() {
	emit(
		'modified',
		ratingExplanation.value,
		ratingProsCons.value,
		ratingQuestion.value,
		ratingResults.value,
		stars.value,
	);
	visible.value = false;
}
</script>

<template>
	<b-modal
		v-model="visible"
		:cancel-title="$t('modals.cancel')"
		ok-variant="success"
		:teleport-disabled="true"
		teleport-to="body"
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

		<b-form-group class="ms-4">
			<b-form-radio-group
				v-if="textRating"
				v-model="textRatingType"
				:options="textRatingTypes"
				stacked
			/>
		</b-form-group>

		<b-form-group
			v-if="ratingExplanation"
			class="ms-4"
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
