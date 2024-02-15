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
				class="ml-2"
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
				class="ml-2"
			>
				{{ aggregatedRating.dislikeCount || 0 }}
			</span>
		</button>
	</div>
</template>

<script>
export default {
	inject: ['aggregatedRating'],
	props: {
		showResults: {
			type: Boolean,
			default: false,
		},
		value: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			rating: this.value || 0,
		};
	},
	watch: {
		value(newValue) {
			this.rating = newValue || 0;
		},
		rating(newValue) {
			this.$emit('input', newValue);
		},
	},
	methods: {
		handleLike() {
			this.rating = this.rating === 1 ? 0 : 1;
		},
		handleDislike() {
			this.rating = this.rating === -1 ? 0 : -1;
		},
	},
};
</script>
