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
					<SurveyEditor
						v-model="sheet.survey"
						:project="project"
						:sheet="sheet"
					/>
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
								@change="openInteractionSettings(o.value)"
							>
								{{ o.text }}
							</b-form-checkbox>
						</div>
						<b-button
							v-if="hasSettings(o.value)"
							class="border-0 ml-auto px-2 py-2 rounded-0"
							variant="outline-primary"
							:disabled="!interactions.enabled.includes(o.value)"
							@click="openInteractionSettings(o.value)"
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
				<RatingSettingsModal
					:interactions="interactions"
					@modified="handleRatingInteractionModified"
				/>
			</b-form-group>

			<b-form-group v-if="canHaveResults">
				<template #label>
					<h6 class="mb-0">
						{{ $t('SheetContent.results') }}
					</h6>
				</template>
				<b-form-checkbox
					v-model="showAllResults"
					@change="showAllResultsClicked"
				>
					{{ $t('sheetEditor.showAllResults') }}
				</b-form-checkbox>
				<b-form-checkbox
					v-if="someResultsEnabled"
					v-model="interactions.enabled"
					value="ShowResultsOnly"
				>
					{{ $t('sheetEditor.interactions.ShowResultsOnly') }}
				</b-form-checkbox>
			</b-form-group>

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
				:filename="sheet.title"
				:is-interactive="isInteractive"
				is-on-editor-view
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

export default {
	components: {
		Map: () => (process.client ? import('@/components/Map') : null),
	},
	provide() {
		return {
			interactions: this.interactions,
			sheet: this.sheet,
		};
	},
	middleware: ['auth'],
	async asyncData({ $axios, store, params, redirect }) {
		store.commit('features/clear');
		try {
			const project = await $axios.$get(`/api/project/${params.id}`);
			const sheet = project.sheets[params.sheetord]; // sheets are ordered on server
			const interactions = deserializeInteractions(sheet?.interactions);

			// BEGIN backward compatibility for #2437
			const descriptionLabel = sheet?.descriptionLabel || '';
			['Point', 'LineString', 'Polygon'].forEach(dt => {
				if (!interactions.descriptionLabels[dt]) {
					interactions.descriptionLabels[dt] = descriptionLabel;
				}
			});
			if (sheet) sheet.descriptionLabel = '';
			// END backward compatibility for #2437

			// BEGIN backward compatibility for #2434
			try {
				const survey = JSON.parse(sheet?.survey);
				if (survey.showResultsOnly) {
					interactions.enabled.push('ShowResultsOnly');
					delete survey.showResultsOnly;
					sheet.survey = JSON.stringify(survey);
				}
			} catch {}
			// END backward compatibility for #2434

			sheet.ratings = await $axios.$get(
				`/api/submission/ratings/${sheet.id}`
			);
			return {
				project,
				sheet,
				interactions,
			};
		} catch (error) {
			redirect('/admin/project/' + params.id);
		}
	},
	data() {
		return {
			backgroundImage: null,
			backgroundImageData: null,
			backgroundImageState: null,
			baseMaps: baseMapList,
			contentModified: false,
			loading: true,
			showAllResults: false,
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
		isAllResultsEnabled() {
			if (!this.interactions.enabled.includes('RatingResults'))
				return false;

			try {
				const { questions } = JSON.parse(this.sheet.survey);
				const questionsWithResults = questions.filter(
					q => q.type && q.type !== 'text'
				);
				if (!questionsWithResults.find(q => !q.showResult)) return true;
			} catch {}
			return false;
		},
		canHaveResults() {
			if (this.interactions.enabled.includes('Rating')) return true;
			try {
				const { questions } = JSON.parse(this.sheet.survey);
				return questions.length > 0;
			} catch {}
			return false;
		},
		someResultsEnabled() {
			if (this.interactions.enabled.includes('RatingResults'))
				return true;
			try {
				const { questions } = JSON.parse(this.sheet.survey);
				return !!questions.find(q => q.showResult);
			} catch {}
			return false;
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
		sheet: {
			handler() {
				this.contentModified = true;
				this.showAllResults = this.isAllResultsEnabled;
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
		this.showAllResults = this.isAllResultsEnabled;
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
			featureLabel,
			featureQuestion
		) {
			this.interactions.buttonLabels[drawType] = buttonLabel;
			this.interactions.descriptionLabels[drawType] = descriptionLabel;
			this.interactions.featureLabels[drawType] = featureLabel;
			this.interactions.featureQuestions[drawType] = featureQuestion;
		},
		handleRatingInteractionModified(
			ratingExplanation,
			ratingProsCons,
			ratingQuestion,
			ratingResults,
			stars
		) {
			this.interactions.ratingQuestion = ratingQuestion;
			this.interactions.stars = stars;
			this.toggleInteraction('RatingExplanation', ratingExplanation);
			this.toggleInteraction('RatingProsCons', ratingProsCons);
			this.toggleInteraction('RatingResults', ratingResults);
		},
		toggleInteraction(ia, enabled) {
			if (enabled) {
				if (!this.interactions.enabled.includes(ia)) {
					this.interactions.enabled.push(ia);
				}
			} else {
				this.interactions.enabled = this.interactions.enabled.filter(
					i => i !== ia
				);
			}
		},
		hasSettings(ia) {
			return ['Point', 'LineString', 'Polygon', 'Rating'].includes(ia);
		},
		openInteractionSettings(ia) {
			if (
				this.hasSettings(ia) &&
				this.interactions.enabled.includes(ia)
			) {
				this.$bvModal.show(ia + '-modal');
			}
		},
		showAllResultsClicked() {
			const showResults = this.showAllResults;
			this.toggleInteraction('RatingResults', showResults);
			const survey = JSON.parse(this.sheet.survey);
			survey.questions?.forEach(q => (q.showResult = showResults));
			this.sheet.survey = JSON.stringify(survey);
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
