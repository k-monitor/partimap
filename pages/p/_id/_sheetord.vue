<template>
	<Sheet
		:parent-project-data="project"
		:sheet-ord="$route.params.sheetord"
		:visitor="true"
	/>
</template>

<script>
export default {
	async asyncData({ $axios, store, params, redirect }) {
		store.commit('features/clear');
		try {
			const project = await $axios.$get('/api/project/' + params.id);
			if (params.id !== project.slug) {
				return redirect(`/p/${project.slug}/${params.sheetord}`);
			}
			return { project };
		} catch (error) {
			redirect('/');
		}
	},
	mounted() {
		if (!this.$store.state.hit && Number(this.$route.params.sheetord) === 0) {
			this.$store.commit('hit');
			this.$axios.$post('/api/view/' + this.$route.params.id);
		}
	}
};
</script>
