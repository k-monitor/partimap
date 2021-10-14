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
		store.commit('generateVisitId');
		try {
			// TODO BUG: called twice, first from server with always regenerating visitId
			const project = await $axios.$post('/api/project/access', {
				projectId: params.id,
				visitId: store.state.visitId,
			});
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
	},
};
</script>
