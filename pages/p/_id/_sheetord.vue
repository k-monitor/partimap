<template>
	<Sheet
		:project-id="projId"
		:sheet-ord="sheetOrd"
	/>
</template>

<script>
export default {
	data() {
		return {
			projId: null,
			sheetOrd: null
		};
	},
	created() {
		this.projId = this.$route.params.id;
		this.sheetOrd = this.$route.params.sheetord;
	},
};
</script>

<style>

</style>
