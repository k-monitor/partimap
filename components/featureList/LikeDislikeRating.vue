<script setup lang="ts">
const aggregatedRating = inject<Ref<AggregatedRating | null>>('aggregatedRating');

const rating = defineModel<number>();

defineProps<{
	showResults: boolean;
}>();

function handleLike() {
	rating.value = rating.value === 1 ? 0 : 1;
}
function handleDislike() {
	rating.value = rating.value === -1 ? 0 : -1;
}
</script>

<template>
	<div class="d-flex">
		<button
			class="btn flex-grow-1"
			:class="{
				'btn-success': rating === 1,
				'btn-outline-success': rating !== 1,
			}"
			:disabled="showResults"
			@click="handleLike"
		>
			<i class="fas fa-thumbs-up" />
			<span
				v-if="showResults"
				class="ms-2"
			>
				{{ aggregatedRating.likeCount || 0 }}
			</span>
		</button>
		<div class="flex-grow-1" />
		<button
			class="btn flex-grow-1"
			:class="{
				'btn-danger': rating === -1,
				'btn-outline-danger': rating !== -1,
			}"
			:disabled="showResults"
			@click="handleDislike"
		>
			<i class="fas fa-thumbs-up fa-flip-both" />
			<span
				v-if="showResults"
				class="ms-2"
			>
				{{ aggregatedRating.dislikeCount || 0 }}
			</span>
		</button>
	</div>
</template>
