<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';
import type { Sheet } from '~/server/data/sheets';

const feature = inject<GeoJsonFeature | null>('feature');
const interactions = inject<Ref<Interactions | null>>('interactions', ref(null));
const sheet = inject<Ref<Sheet | null>>('sheet', ref(null));

defineProps<{
	showResults: boolean;
}>();

const { getVisitorRatings, setVisitorRatings } = useVisitorData();

function getRatingObj() {
	if (!sheet.value) return {};
	const ratings: Record<string, VisitorRating> = getVisitorRatings(sheet.value.id) || {};
	return ratings[String(feature?.id)] || ({} as VisitorRating);
}

const ratingValue = ref<number | undefined>();
const ratingAnswers = ref<{
	answer: string | undefined;
	pros: string | undefined;
	cons: string | undefined;
}>({
	answer: undefined,
	pros: undefined,
	cons: undefined,
});

onMounted(() => {
	const ratingObj = getRatingObj();
	ratingValue.value = ratingObj.value;
	ratingAnswers.value.answer = ratingObj.answer;
	ratingAnswers.value.pros = ratingObj.pros;
	ratingAnswers.value.cons = ratingObj.cons;
});

function storeRating(ratingObj: VisitorRating) {
	if (!sheet.value || !feature) return;
	const ratings = getVisitorRatings(sheet.value.id) || {};
	delete ratings[String(feature.id)];
	if (ratingObj.value) ratings[String(feature.id)] = ratingObj;
	setVisitorRatings(sheet.value.id, ratings);
}

watch(ratingValue, (newValue) => {
	const ratingObj = getRatingObj();
	ratingObj.value = newValue;
	storeRating(ratingObj);

	// update map and FLE header
	if (feature && feature.properties) feature.properties.rating = newValue;
});

watch(
	ratingAnswers,
	(newValue) => {
		const ratingObj = getRatingObj();
		ratingObj.answer = newValue.answer;
		ratingObj.pros = newValue.pros;
		ratingObj.cons = newValue.cons;
		storeRating(ratingObj);
	},
	{ deep: true },
);
</script>

<template>
	<div
		class="d-flex flex-column"
		style="gap: 1rem"
	>
		<LikeDislikeRating
			v-if="interactions?.stars === -2"
			v-model="ratingValue"
			:show-results="showResults"
		/>
		<StarRating
			v-else
			v-model="ratingValue"
			:show-results="showResults"
		/>

		<client-only v-if="ratingValue && !showResults">
			<template v-if="interactions?.enabled?.includes('RatingExplanation')">
				<b-form-group
					:label="interactions?.ratingQuestion || $t('sheetEditor.defaultRatingQuestion')"
				>
					<textarea
						v-model="ratingAnswers.answer"
						class="form-control form-control-sm"
					/>
				</b-form-group>
			</template>
			<div
				v-else-if="interactions?.enabled?.includes('RatingProsCons')"
				class="row"
			>
				<b-form-group class="col-xl-6">
					<template #label>
						<span class="text-success">
							<i class="fas fa-fw fa-thumbs-up me-1" />
							{{ $t('FeatureRatingControls.pros') }}
						</span>
					</template>
					<textarea
						v-model="ratingAnswers.pros"
						class="form-control form-control-sm"
					/>
				</b-form-group>
				<b-form-group class="col">
					<template #label>
						<span class="text-danger">
							<i class="fas fa-fw fa-thumbs-up fa-flip-both me-1" />
							{{ $t('FeatureRatingControls.cons') }}
						</span>
					</template>
					<textarea
						v-model="ratingAnswers.cons"
						class="form-control form-control-sm"
					/>
				</b-form-group>
			</div>
		</client-only>
	</div>
</template>
