<template>
	<Sheet
		:project="project"
		:sheet-ord="$route.params.sheetord"
	/>
</template>

<script>
export default {
	middleware: ['auth'],
	async asyncData({ $axios, store, params, redirect }) {
		store.commit('features/clear');
		try {
			const project = await $axios.$get('/api/project/' + params.id);
			return { project };
		} catch (error) {
			redirect('/admin/project/' + params.id);
		}
	},
	head() {
		return {
			title: `Admin: ${this.project.title} (${Number(this.$route.params.sheetord) + 1}/${this.project.sheets.length})`,
		};
	},
};
</script>
