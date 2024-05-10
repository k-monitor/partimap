<script setup lang="ts">
import type { AggregatedRating } from '~/server/data/ratings';

const aggregatedRating = inject<Ref<AggregatedRating | null>>('aggregatedRating');
const interactions = inject<Ref<Interactions | null>>('interactions');

const model = defineModel<number>();

const props = defineProps<{
	showResults: boolean;
}>();

const rating = ref(0);

function updateDisplayedRating() {
	rating.value = (props.showResults ? aggregatedRating?.value?.average : model.value) || 0;
}
onMounted(updateDisplayedRating);
watch(model, updateDisplayedRating);

watch(rating, (newRating) => {
	if (!props.showResults) model.value = newRating;
});
</script>

<template>
	<div class="border d-flex fw-bold justify-content-center p-2">
		<VueStarRating
			v-model:rating="rating"
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
			v-if="showResults && aggregatedRating?.count"
			class="ms-3"
		>
			<span v-if="interactions?.stars === 1">
				<small class="fas fa-user fa-fw" />
				{{ aggregatedRating.count }}
			</span>
			<span v-else>
				{{ Number(rating).toFixed(1) }}
				(<small class="fas fa-user fa-fw" /> {{ aggregatedRating.count || 0 }})
			</span>
		</span>
	</div>
</template>
