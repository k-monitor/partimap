<template>
	<b-modal
		id="featureImportModal"
		ref="modal"
		hide-footer
		:title="$t('FeatureImportModal.title')"
	>
		<b-form-group :label="$t('FeatureImportModal.fromMap')">
			<div class="d-flex">
				<b-form-select
					v-model="mapId"
					:options="mapOptions"
				/>
				<b-button
					class="ml-3"
					:disabled="!mapId"
					variant="success"
					@click="importFromMap"
				>
					<i class="fas fa-fw fa-file-import" />
				</b-button>
			</div>
		</b-form-group>

		<hr />

		<b-form-group :label="$t('FeatureImportModal.fromSubmitted')">
			<b-form-select
				v-model="projectId"
				:options="projectOptions"
			/>
			<div class="d-flex mt-3">
				<b-form-select
					v-model="sheetId"
					:disabled="!sheets || !sheets.length"
					:options="sheetOptions"
				/>
				<b-button
					class="ml-3"
					:disabled="!sheetId"
					variant="success"
					@click="importSubmitted"
				>
					<i class="fas fa-fw fa-file-import" />
				</b-button>
			</div>
		</b-form-group>
	</b-modal>
</template>

<script>
import GeoJSON from 'ol/format/GeoJSON';

export default {
	data() {
		return {
			mapId: null,
			maps: [],
			projectId: null,
			projects: [],
			sheetId: null,
			sheets: [],
		};
	},
	async fetch() {
		const maps = await this.$axios.$get('/api/maps');
		this.maps = maps
			.map(m => {
				const f = JSON.parse(m.features || '[]');
				m.featureCount = f.length;
				return m;
			})
			.filter(m => m.featureCount);

		const projects = await this.$axios.$get('/api/projects');
		this.projects = projects.filter(p => p.userId === this.$auth.user.id);
	},
	computed: {
		mapOptions() {
			return [
				{ value: null, text: this.$t('FeatureImportModal.selectMap') },
				...this.maps.map(m => ({
					value: m.id,
					text: `${m.title} (${m.featureCount} elem)`, // TODO i18n
				})),
			];
		},
		projectOptions() {
			return [
				{
					value: null,
					text: this.$t('FeatureImportModal.selectProject'),
				},
				...this.projects.map(p => ({
					value: p.id,
					text: p.title,
				})),
			];
		},
		sheetOptions() {
			return [
				{
					value: null,
					text: this.$t('FeatureImportModal.selectSheet'),
				},
				...this.sheets.map(s => ({
					value: s.id,
					text: `${s.title} (${s.submittedFeatureCount} elem)`, // TODO i18n
				})),
			];
		},
	},
	watch: {
		async projectId(pid) {
			if (!pid) {
				this.sheetId = null;
				this.sheets = [];
				return;
			}
			const project = await this.$axios.$get('/api/project/' + pid);
			const sfcs = await this.$axios.$get(
				'/api/submission/feature-counts/' + pid
			);
			project.sheets.forEach((s, i) => {
				project.sheets[i].submittedFeatureCount = Number(
					sfcs[s.id] || 0
				);
			});
			this.sheets = project.sheets.filter(s => s.submittedFeatureCount);
		},
	},
	methods: {
		importFromMap() {
			const map = this.maps.find(m => m.id === this.mapId);
			if (!map) return;
			const features = JSON.parse(map.features);
			this.emitFeatures(features);
		},
		async importSubmitted() {
			if (!this.sheetId) return;
			const submissions = await this.$axios.$get(
				'/api/submitted-features/' + this.sheetId
			);
			const features = submissions
				.map(s => JSON.parse(s.features))
				.flat();
			this.emitFeatures(features);
		},
		emitFeatures(features) {
			this.$emit(
				'import-features',
				features.map(f => new GeoJSON().readFeature(f))
			);
			this.$refs.modal.hide();
		},
	},
};
</script>
