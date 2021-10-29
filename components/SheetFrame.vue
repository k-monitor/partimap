<template>
	<div
		class="flex-grow-1 sheet"
		:style="{ backgroundImage }"
	>
		<slot />
	</div>
</template>

<script>
export default {
	props: {
		backgroundImageUrl: {
			type: String,
			default: null,
		},
	},
	computed: {
		backgroundImage() {
			return this.backgroundImageUrl ? `url(${this.backgroundImageUrl})` : null;
		},
	},
};
</script>

<style>
.sheet {
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
}
</style>
