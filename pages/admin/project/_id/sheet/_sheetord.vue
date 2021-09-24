<template>
	<Sheet
		:parent-project-data="project"
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
			// const sheet = this.project.sheets.filter(sheet => sheet.ord === parseInt(params.sheetOrd))[0];
			return { project };
		} catch (error) {
			redirect('/admin/project/' + params.id);
		}
	},
};
</script>
