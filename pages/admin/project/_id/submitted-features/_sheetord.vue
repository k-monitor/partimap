<template>
	<div>
		<client-only>
			<Map
				:key="$route.path"
				:features="loadInitFeatures()"
				fit-selected
			/>
		</client-only>
		<Sidebar
			admin
			:back-label="$t('sheetEditor.back')"
			:loading="loading"
			@back="back"
		>
			<b-navbar class="m-0 mb-4 p-0">
				<h1 class="h3">
					{{ sheet.title }}
				</h1>
			</b-navbar>
			<FeatureList
				:filename="sheet.title"
				readonly
			/>
		</Sidebar>
	</div>
</template>

<script>
import GeoJSON from 'ol/format/GeoJSON';

export default {
	middleware: ['auth'],
	async asyncData({ $axios, store, params, redirect, localePath }) {
		store.commit('features/clear');
		try {
			const project = await $axios.$get(`/api/project/${params.id}`);
			const sheet = project.sheets[params.sheetord]; // sheets are ordered on server
			const submissions = await $axios.$get(
				'/api/submitted-features/' + sheet.id
			);
			const features = submissions
				.map(s => JSON.parse(s.features))
				.flat();
			return { features, project, sheet };
		} catch (error) {
			redirect(localePath('/admin/projects'));
		}
	},
	data() {
		return {
			loading: true,
		};
	},
	head() {
		return {
			title: `Admin: ${this.sheet?.title}`,
		};
	},
	mounted() {
		this.$store.commit('selected/clear');
		this.loading = false;
	},
	methods: {
		back() {
			this.$router.push(
				this.localePath(`/admin/project/${this.project.id}`)
			);
		},
		loadInitFeatures() {
			const features = this.features;
			const featureCollection = { type: 'FeatureCollection', features };
			return features
				? new GeoJSON().readFeatures(featureCollection)
				: null;
		},
	},
};
</script>
