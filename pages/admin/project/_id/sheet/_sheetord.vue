<template>
	<SheetFrame :background-image-url="backgroundImageData || sheet.image">
		<template v-if="sheet.features">
			<client-only>
				<Map
					:key="$route.path"
					:features="loadInitFeatures()"
					:initial-base-map-key="interactions.baseMap"
				/>
				<template #placeholder>
					<div class="h-100 position-absolute w-100 map" />
				</template>
			</client-only>
			<MapToolbar />
			<MapHint />
		</template>
		<Sidebar
			admin
			:back-label="$t('sheetEditor.back')"
			:fixed="!sheet.features"
			:loading="loading"
			:project="project"
			@back="back"
		>
			<b-form-group>
				<template #label>
					<h6 class="mb-0">{{ $t('sheetEditor.sheetName') }}</h6>
				</template>
				<b-form-input
					v-model="sheet.title"
					size="lg"
				/>
			</b-form-group>
			<b-form-group
				class="rich"
				:label="$t('sheetEditor.sheetDescription')"
			>
				<client-only>
					<tiptap v-model="sheet.description" />
				</client-only>
			</b-form-group>
			<b-form-group
				v-if="!sheet.features"
				:invalid-feedback="$t('imageUpload.maxFileSize')"
				:state="backgroundImageState"
			>
				<template #label>
					<h6 class="mb-0">
						{{ $t('sheetEditor.backgroundImage') }}
					</h6>
				</template>
				<b-input-group v-if="!sheet.image">
					<b-form-file
						v-model="backgroundImage"
						accept="image/jpeg, image/png, image/webp"
						class="sheet-background-input"
						browse-text=""
						:drop-placeholder="$t('imageUpload.dropzone')"
						:placeholder="$t('imageUpload.browse')"
						:state="backgroundImageState"
					/>
					<template #append>
						<b-button
							:disabled="!backgroundImage"
							variant="outline-danger"
							@click="removeBackground"
						>
							<i class="fas fa-backspace" />
						</b-button>
					</template>
				</b-input-group>
				<b-button
					v-else
					class="w-100"
					variant="outline-danger"
					@click="removeBackground"
				>
					{{ $t('imageUpload.remove') }}
				</b-button>
			</b-form-group>
			<b-form-group v-if="sheet.survey">
				<template #label>
					<h6 class="mb-0">{{ $t('sheetEditor.survey') }}</h6>
				</template>
				<client-only>
					<SurveyEditor v-model="sheet.survey" />
				</client-only>
			</b-form-group>
			<b-form-group v-if="interactionOptions.length">
				<template #label>
					<h6 class="mb-0">
						{{ $t('sheetEditor.visitorInteractions') }}
					</h6>
				</template>
				<b-list-group class="mb-3">
					<b-list-group-item
						v-for="o in interactionOptions"
						:key="o.value"
						class="d-flex p-0 align-items-center"
					>
						<div class="p-2">
							<b-form-checkbox
								v-model="interactions.enabled"
								:value="o.value"
							>
								{{ o.text }}
							</b-form-checkbox>
						</div>
						<b-button
							v-if="
								['Point', 'LineString', 'Polygon'].includes(
									o.value
								)
							"
							class="border-0 ml-auto px-2 py-2 rounded-0"
							variant="outline-primary"
							:disabled="!interactions.enabled.includes(o.value)"
							@click="$bvModal.show(o.value + '-modal')"
						>
							<i class="fas fa-fw fa-cog" />
						</b-button>
					</b-list-group-item>
				</b-list-group>
				<InteractionSettingsModal
					v-for="dt in ['Point', 'LineString', 'Polygon']"
					:id="dt + '-modal'"
					:key="dt"
					:draw-type="dt"
					:interactions="interactions"
					@modified="handleInteractionModified"
				/>
			</b-form-group>

			<div v-if="isRatingSelected">
				<b-form-group :label="$t('sheetEditor.ratingType')">
					<b-form-radio-group
						v-model="ratingType"
						:options="ratingTypes"
						stacked
					/>
				</b-form-group>
				<b-form-group
					v-if="interactions.stars !== -2"
					:label="$t('sheetEditor.numberOfStars')"
					label-cols="7"
					label-for="stars"
				>
					<b-form-input
						id="stars"
						v-model.number="interactions.stars"
						max="10"
						min="1"
						type="number"
					/>
				</b-form-group>
			</div>

			<b-form-group
				v-if="isInteractive || sheet.features"
				:label="$t('sheetEditor.defaultBaseMap')"
			>
				<b-form-select
					v-model="interactions.baseMap"
					:options="baseMaps"
				/>
			</b-form-group>

			<FeatureList
				v-if="sheet.features"
				:init-feature-ratings="submittedRatings"
				:interactions="interactions"
			/>

			<template #footer>
				<div
					class="align-items-center d-flex justify-content-between p-2 w-100"
				>
					<div class="fixed-width">
						<b-button
							variant="primary"
							@click="prev"
						>
							<i class="fas fa-fw fa-chevron-left" />
						</b-button>
					</div>
					<SaveButton
						:content-modified="contentModified"
						@save="save"
					/>
					<b-button
						v-if="project.id"
						:href="previewUrl"
						target="_blank"
						variant="outline-primary"
					>
						<i class="fas fa-external-link-alt fa-fw" />
					</b-button>
					<div class="fixed-width">
						<b-button
							v-if="!isLastSheet"
							variant="primary"
							@click="next"
						>
							<i class="fas fa-fw fa-chevron-right" />
						</b-button>
						<b-button
							v-else
							variant="success"
							@click="openNewSheetModal"
						>
							<i class="fas fa-fw fa-plus" />
						</b-button>
					</div>
				</div>
			</template>
		</Sidebar>
		<NewSheetModal
			:project-id="project.id"
			@addedSheet="addedSheet"
		/>
	</SheetFrame>
</template>

<script>
import GeoJSON from 'ol/format/GeoJSON';
import { mapGetters, mapMutations } from 'vuex';
import {
	deserializeInteractions,
	serializeInteractions,
} from '@/assets/interactions';
import { baseMapList } from '@/assets/basemaps';
import InteractionSettingsModal from '~/components/InteractionSettingsModal.vue';
import SaveButton from '~/components/SaveButton.vue';
import NewSheetModal from '~/components/NewSheetModal.vue';

export default {
	components: {
		Map: () => (process.client ? import('@/components/Map') : null),
		SaveButton,
		NewSheetModal,
		InteractionSettingsModal,
	},
	middleware: ['auth'],
	async asyncData({ $axios, store, params, redirect }) {
		store.commit('features/clear');
		try {
			const project = await $axios.$get(`/api/project/${params.id}`);
			const sheet = project.sheets[params.sheetord]; // sheets are ordered on server
			const interactions = deserializeInteractions(sheet?.interactions);
			const ratingType = interactions.stars === -2 ? 1 : 0;
			const submittedRatings = await $axios.$get(
				`/api/submission/ratings/${sheet.id}`
			);

			// BEGIN backward compatibility for #2437
			const descriptionLabel = sheet?.descriptionLabel || '';
			['Point', 'LineString', 'Polygon'].forEach(dt => {
				if (!interactions.descriptionLabels[dt]) {
					interactions.descriptionLabels[dt] = descriptionLabel;
				}
			});
			if (sheet) sheet.descriptionLabel = '';
			// END backward compatibility for #2437

			return {
				project,
				sheet,
				interactions,
				submittedRatings,
				ratingType,
			};
		} catch (error) {
			redirect('/admin/project/' + params.id);
		}
	},
	data() {
		const ratingTypes = [
			{ value: 0, text: this.$t('sheetEditor.ratingTypes.stars') },
			{ value: 1, text: this.$t('sheetEditor.ratingTypes.likeDislike') },
		];
		return {
			backgroundImage: null,
			backgroundImageData: null,
			backgroundImageState: null,
			baseMaps: baseMapList,
			contentModified: false,
			loading: true,
			ratingTypes,
		};
	},
	head() {
		return {
			title: `Admin: ${this.project.title} (${
				Number(this.$route.params.sheetord) + 1
			}/${this.project.sheets.length})`,
		};
	},
	computed: {
		...mapGetters('features', ['getAllFeature']),
		interactionOptions() {
			const options = [];
			const ia = n => ({
				value: n,
				text: this.$t(`sheetEditor.interactions.${n}`),
			});
			if (this.sheet.features) {
				// map sheet
				if (!this.sheet.survey) {
					// interactive map sheet
					options.push(ia('Point'), ia('LineString'), ia('Polygon'));
					if (this.isInteractive) {
						options.push(ia('naming'));
					}
				} else {
					options.push(ia('Rating'));
				}
			} else {
				options.push(ia('SocialSharing'));
			}
			return options;
		},
		isFirstSheet() {
			return this.sheet.ord === 0;
		},
		isLastSheet() {
			return this.sheet.ord === this.project.sheets.length - 1;
		},
		isInteractive() {
			return (
				this.isPointSelected ||
				this.isLineStringSelected ||
				this.isPolygonSelected
			);
		},
		isPointSelected() {
			return this.interactions.enabled.includes('Point');
		},
		isLineStringSelected() {
			return this.interactions.enabled.includes('LineString');
		},
		isPolygonSelected() {
			return this.interactions.enabled.includes('Polygon');
		},
		isRatingSelected() {
			return this.interactions.enabled.includes('Rating');
		},
		previewUrl() {
			return `/${this.$i18n.locale}/p/${this.project.slug}/${this.sheet.ord}?force=1`;
		},
	},
	watch: {
		backgroundImage(val) {
			this.contentModified = true;
			this.backgroundImageData = null;
			if (!val) {
				// clear validation error message on file removal
				this.backgroundImageState = null;
			} else {
				const valid = this.backgroundImage.size < 5 * 1024 * 1024;
				this.backgroundImageState = valid;
				if (valid) {
					const reader = new FileReader();
					reader.onloadend = () => {
						this.backgroundImageData = reader.result;
					};
					reader.readAsDataURL(val);
				}
			}
		},
		interactions: {
			handler(interactions) {
				this.sheet.interactions = serializeInteractions(interactions);
				if (interactions.baseMap) {
					this.setBaseMap(interactions.baseMap);
				}
			},
			deep: true,
		},
		ratingType(v) {
			this.interactions.stars = v === 1 ? -2 : 5;
		},
		sheet: {
			handler() {
				this.contentModified = true;
			},
			deep: true,
		},
	},
	created() {
		this.$nuxt.$on('contentModified', () => {
			this.contentModified = true;
		});
		this.$nuxt.$on('toggleLoading', value => (this.loading = value));
	},
	beforeDestroy() {
		this.$nuxt.$off('contentModified');
		this.$nuxt.$off('toggleLoading');
	},
	mounted() {
		this.$store.commit('selected/clear');
		this.loading = false;
	},
	methods: {
		...mapMutations(['setBaseMap']),
		async back() {
			if (this.contentModified) {
				const confirmed = await this.confirmLeavingUnsaved();
				if (!confirmed) return;
			}
			this.$router.push(
				this.localePath(`/admin/project/${this.project.id}`)
			);
		},
		async next() {
			if (this.contentModified) {
				const confirmed = await this.confirmLeavingUnsaved();
				if (!confirmed) return;
			}
			this.goToSheetOrd(this.sheet.ord + 1);
		},
		async prev() {
			if (this.contentModified) {
				const confirmed = await this.confirmLeavingUnsaved();
				if (!confirmed) return;
			}
			if (this.isFirstSheet) {
				this.back();
			} else {
				this.goToSheetOrd(this.sheet.ord - 1);
			}
		},
		addedSheet(sheet) {
			this.project.sheets.push(sheet);
			this.next();
		},
		featuresFromRaw(featuresRaw) {
			const features = JSON.parse(featuresRaw);
			const featureCollection = { type: 'FeatureCollection', features };
			return features
				? new GeoJSON().readFeatures(featureCollection)
				: null;
		},
		goToSheetOrd(ord) {
			this.$router.push(
				this.$route.fullPath.replace(/[?#].*$/, '').replace(/\d+$/, ord)
			);
		},
		handleInteractionModified(
			drawType,
			buttonLabel,
			descriptionLabel,
			featureLabel
		) {
			this.interactions.buttonLabels[drawType] = buttonLabel;
			this.interactions.descriptionLabels[drawType] = descriptionLabel;
			this.interactions.featureLabels[drawType] = featureLabel;
		},
		loadFeaturesFromStore() {
			const features = [];
			for (const f of this.getAllFeature) {
				const featureStr = new GeoJSON().writeFeature(f);
				features.push(JSON.parse(featureStr));
			}
			this.sheet.features = JSON.stringify(features);
		},
		loadInitFeatures() {
			return this.featuresFromRaw(this.sheet.features);
		},
		openNewSheetModal() {
			this.$bvModal.show('create-sheet-modal');
		},
		removeBackground() {
			this.backgroundImage = null;
			this.sheet.image = null;
		},
		async save() {
			if (this.sheet.features) {
				this.loadFeaturesFromStore();
			}
			this.loading = true;
			if (this.backgroundImage) {
				await this.uploadBackground();
			}
			try {
				this.sheet = await this.$axios.$patch('/api/sheet', this.sheet);
				this.$nextTick(() => {
					this.contentModified = false;
				});
				this.success(this.$t('sheetEditor.success'));
			} catch {
				this.errorToast(this.$t('sheetEditor.saveFailed'));
			}
			this.loading = false;
		},
		async uploadBackground() {
			if (!this.backgroundImageState) {
				return;
			}
			const formData = new FormData();
			formData.append('image', this.backgroundImage);
			try {
				this.sheet = await this.$axios.$put(
					'/api/sheet/' + this.sheet.id + '/image',
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					}
				);
				this.backgroundImage = null;
			} catch (error) {
				this.errorToast(this.$t('imageUpload.failed'));
			}
		},
	},
};
</script>

<style>
.sheet-background-input .custom-file-label::after {
	/* does not work in scoped style block */
	display: none !important;
}
</style>
