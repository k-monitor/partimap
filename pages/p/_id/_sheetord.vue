<template>
	<Sheet
		:parent-project-data="project"
		:sheet-ord="$route.params.sheetord"
	/>
</template>

<script>
export default {
	async asyncData({ $axios, store, params, redirect }) {
		store.commit('features/clear');
		try {
			const project = await $axios.$get('/api/project/' + params.id);
			return { project };
		} catch (error) {
			redirect('/');
		}
	},
};
</script>
