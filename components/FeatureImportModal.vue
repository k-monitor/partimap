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
					class="ml-2"
					:disabled="!mapId"
					variant="success"
					@click="importFromMap"
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
			projects: [],
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

		// this.projects = await this.$axios.get('/api/projects');
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
			return this.projects.map(p => ({
				value: p.id,
				text: p.title,
			}));
		},
	},
	methods: {
		importFromMap() {
			const map = this.maps.find(m => m.id === this.mapId);
			if (!map) return;
			const features = JSON.parse(map.features).map(f =>
				new GeoJSON().readFeature(f)
			);
			this.$emit('import-features', features);
			this.$refs.modal.hide();
		},
	},
};
</script>
