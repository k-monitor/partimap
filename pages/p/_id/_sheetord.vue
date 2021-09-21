<template>
	<div>{{ projId }}, {{ sheetOrd }}</div>
</template>

<script>
export default {
	created() {
		this.projId = this.$route.params.id;
		this.sheetOrd = this.$route.params.sheetord;
	},
};
</script>

<style>

</style>
