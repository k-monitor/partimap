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

				<NewSheetModal @addSheet="addSheet" />
			</template>
			<div class="list-group">
				<div
					v-for="sheet in sheets"
					:key="sheet.ord"
					class="align-items-center d-flex flex-wrap list-group-item px-2"
					style="gap: 0.5rem"
				>
					<div class="d-flex">
						<i
							:class="sheetIcon(sheet)"
							class="fas fa-fw mr-3 mt-1"
						/>
						<span class="d-none d-lg-block mr-3"
							>{{ sheet.ord + 1 }}.</span
						>
						<div>
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
							<span
								v-if="sheet.submittedFeatureCount"
								class="d-flex flex-wrap"
							>
								{{
									$t('ProjectSheetManager.submittedFeatures')
								}}:
								{{ sheet.submittedFeatureCount }}
								<a
									class="ml-2"
									href="javascript:void(0)"
									@click.prevent="
										submittedFeaturesToMap(sheet)
									"
									>{{
										$t('ProjectSheetManager.sendToMap')
									}}</a
								>
							</span>
						</div>
					</div>
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
							@click.prevent="$emit('moveSheet', 'down', sheet)"
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
			</div>
		</b-card>
	</b-container>
</template>

<script>
import NewSheetModal from './NewSheetModal.vue';
import { deserializeInteractions } from '~/assets/interactions';
import sheetTypes from '~/assets/sheetTypes';

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
		addSheet(title, type, sourceMap) {
			this.$emit('addSheet', title, type, sourceMap);
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
	},
};
</script>
