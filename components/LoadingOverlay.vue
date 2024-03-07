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
	<client-only>
		<b-overlay
			no-wrap
			opacity="0.5"
			:show="show"
		/>
	</client-only>
</template>

<style scoped>
.b-overlay-wrap {
	position: static !important;
}
</style>
