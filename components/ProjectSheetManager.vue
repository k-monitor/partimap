<template>
	<b-container class="mb-5">
		<b-card class="shadow-sm">
			<template #header>
				<b-button
					v-b-modal.create-sheet-modal
					class="float-right"
					variant="success"
					type="button"
					@click="openNewSheetModal"
				>
					{{ $t('ProjectSheetManager.addSheet') }}
				</b-button>

				<NewSheetModal
					:project-id="projectId"
					@addedSheet="addedSheet"
				/>
			</template>
			<div class="list-group">
				<div
					v-for="sheet in sheets"
					:key="sheet.ord"
					class="d-flex flex-column list-group-item px-2"
					style="gap: 0.5rem"
				>
					<div class="d-flex">
						<div class="d-flex flex-shrink-0">
							<i
								:class="sheetIcon(sheet)"
								class="fas fa-fw mr-3 mt-1"
							/>
							<span class="d-none d-lg-block mr-3">
								{{ sheet.ord + 1 }}.
							</span>
						</div>
						<NuxtLink
							:to="
								localePath(
									'/admin/project/' +
										projectId +
										'/sheet/' +
										sheet.ord
								)
							"
							class="font-weight-bold mr-2"
						>
							{{ sheet.title }}
						</NuxtLink>

						<div class="d-flex ml-auto">
							<span
								v-if="sheet.ord"
								class="mr-3"
								role="button"
								@click.prevent="$emit('moveSheet', 'up', sheet)"
							>
								<i class="fas fa-fw fa-arrow-up" />
							</span>
							<span
								v-if="(sheet.ord || 0) < sheets.length - 1"
								class="mr-3"
								role="button"
								@click.prevent="
									$emit('moveSheet', 'down', sheet)
								"
							>
								<i class="fas fa-fw fa-arrow-down" />
							</span>
							<span
								class="text-danger"
								role="button"
								@click.prevent="deleteSheet(sheet)"
							>
								<i class="fas fa-fw fa-trash" />
							</span>
						</div>
					</div>

					<div
						v-if="sheet.submittedFeatureCount"
						class="d-flex flex-wrap pl-4"
						style="gap: 0.5rem"
					>
						<b-button
							size="sm"
							variant="primary"
							:to="
								localePath(
									'/admin/project/' +
										projectId +
										'/submitted-features/' +
										sheet.ord
								)
							"
						>
							<i class="fas fa-fw fa-eye" />
							<strong>{{ sheet.submittedFeatureCount }}</strong>
							{{ $t('ProjectSheetManager.submittedFeatures') }}
						</b-button>

						<b-button
							size="sm"
							variant="outline-primary"
							@click.prevent="submittedFeaturesToMap(sheet)"
						>
							<i class="fas fa-fw fa-plus-circle" />
							{{ $t('ProjectSheetManager.sendToMap') }}
						</b-button>

						<b-button
							size="sm"
							variant="outline-primary"
							@click.prevent="submittedFeaturesToKML(sheet)"
						>
							<i class="fas fa-fw fa-download" />
							KML
						</b-button>
					</div>
				</div>
			</div>
		</b-card>
	</b-container>
</template>

<script>
import { saveAs } from 'file-saver';
import GeoJSON from 'ol/format/GeoJSON';
import NewSheetModal from './NewSheetModal.vue';
import { deserializeInteractions } from '@/assets/interactions';
import { featuresToKML } from '@/assets/kml';
import sheetTypes from '@/assets/sheetTypes';

export default {
	components: {
		NewSheetModal,
	},
	props: {
		projectId: {
			type: Number,
			default: 0,
		},
		project: {
			// TODO makes sheets and projectId props redundant
			type: Object,
			default: null,
		},
		sheets: {
			type: Array,
			default: () => [],
		},
	},
	methods: {
		addedSheet(sheet) {
			this.$emit('addedSheet', sheet);
		},
		openNewSheetModal() {
			this.$bvModal.show('create-sheet-modal');
		},
		sheetType(sheet) {
			const interactions = deserializeInteractions(sheet.interactions);
			if (!sheet) {
				return null;
			}
			if (sheet.features) {
				const isInteractive =
					interactions.enabled.includes('Point') ||
					interactions.enabled.includes('LineString') ||
					interactions.enabled.includes('Polygon');
				return isInteractive ? 'interactiveMap' : 'staticMap';
			} else if (sheet.survey) {
				return 'survey';
			} else {
				return 'text';
			}
		},
		sheetIcon(sheet) {
			const type = this.sheetType(sheet);
			return sheetTypes.filter(t => t.name === type)[0].icon;
		},
		async deleteSheet(sheet) {
			const confirmed = await this.confirmDeletion(sheet.title);
			if (confirmed) {
				this.$emit('delSheet', sheet);
			}
		},
		async submittedFeaturesToMap(sheet) {
			const data = {
				title: `${this.project.title} / ${
					sheet.title
				} ${new Date().toLocaleString()}`,
				importSubmittedFeatures: sheet.id,
			};
			const map = await this.$axios.$put('/api/map', data);
			this.$router.push(this.localePath('/admin/map/' + map.id));
		},
		async submittedFeaturesToKML(sheet) {
			const submissions = await this.$axios.$get(
				'/api/submitted-features/' + sheet.id
			);
			const features = submissions
				.map(s => JSON.parse(s.features))
				.flat()
				.map(f => new GeoJSON().readFeature(f));
			const kml = featuresToKML(features);
			const blob = new Blob([kml], {
				type: 'application/vnd.google-earth.kml+xml;charset=utf-8',
			});
			saveAs(blob, 'partimap.kml');
		},
	},
};
</script>
