<script>
export default {
	props: {
		show: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<template>
	<b-overlay
		no-wrap
		opacity="0.5"
		:show="show"
	/>
</template>

<style scoped>
.b-overlay-wrap {
	position: static !important;
}
</style>
