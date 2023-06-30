<template>
	<b-modal
		id="featureImportModal"
		ref="modal"
		hide-footer
		:title="$t('FeatureImportModal.title')"
	>
		<b-form-group :label="$t('FeatureImportModal.importFromMap')">
			<b-form-select
				v-model="map"
				class="mb-3"
				:options="mapOptions"
			/>
			<div class="d-flex justify-content-end">
				<b-button
					:disabled="!map"
					variant="success"
					@click="importFromMap"
				>
					<i class="fas fa-fw fa-file-import" />
					{{
						$t('FeatureImportModal.doImportFromMap', {
							n: map?.featureCount || 0,
						})
					}}
				</b-button>
			</div>
		</b-form-group>

		<hr class="mt-4" />

		<b-form-group :label="$t('FeatureImportModal.importFromSheet')">
			<b-form-select
				v-model="project"
				class="mb-3"
				:options="projectOptions"
			/>
			<b-form-select
				v-model="sheet"
				class="mb-3"
				:disabled="!sheets || !sheets.length"
				:options="sheetOptions"
			/>
			<div class="d-flex">
				<b-button
					:disabled="!sheet || !sheet.submittedFeatureCount"
					variant="success"
					@click="importSubmitted"
				>
					<i class="fas fa-fw fa-file-import" />
					{{
						$t('FeatureImportModal.doImportSubmitted', {
							n: sheet?.submittedFeatureCount || 0,
						})
					}}
				</b-button>
				<b-button
					class="ml-3"
					:disabled="!sheet || !sheet.featureCount"
					variant="success"
					@click="importFixed"
				>
					<i class="fas fa-fw fa-file-import" />
					{{
						$t('FeatureImportModal.doImportFixed', {
							n: sheet?.featureCount || 0,
						})
					}}
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
			map: null,
			maps: [],
			project: null,
			projects: [],
			sheet: null,
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
					value: m,
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
					value: p,
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
					value: s,
					text: `${s.title}`,
				})),
			];
		},
	},
	watch: {
		async project(project) {
			if (!project) {
				this.sheetId = null;
				this.sheets = [];
				return;
			}
			project = await this.$axios.$get('/api/project/' + project.id);
			const sfcs = await this.$axios.$get(
				'/api/submission/feature-counts/' + project.id
			);
			project.sheets = project.sheets.map((s, i) => {
				const f = JSON.parse(s.features || '[]');
				s.featureCount = f.length;
				s.submittedFeatureCount = Number(sfcs[s.id] || 0);
				return s;
			});
			this.sheets = project.sheets.filter(
				s => s.featureCount + s.submittedFeatureCount > 0
			);
		},
	},
	methods: {
		importFromMap() {
			if (!this.map) return;
			const features = JSON.parse(this.map.features);
			this.emitFeatures(features);
		},
		importFixed() {
			if (!this.sheet) return;
			const features = JSON.parse(this.sheet.features);
			this.emitFeatures(features);
		},
		async importSubmitted() {
			if (!this.sheet) return;
			const submissions = await this.$axios.$get(
				'/api/submitted-features/' + this.sheet.id
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
