<template>
	<div
		v-if="sheet"
		class="flex-grow-1"
		:style="'background: center / cover no-repeat url(' + sheet.image + ')'"
	>
		<AdminSidebar

			back-label="Projekt"
			:content-modified="contentModified"
			@back="goBackToProject"
			@save="saveMap"
		>
			<b-form-group
				class="mb-4"
				label="Cím:"
			>
				<template #label>
					<h6 class="mb-0">Munkalap címe</h6>
				</template>
				<b-form-input
					v-model="sheet.title"
					size="lg"
				/>
			</b-form-group>
			<b-form-group>
				<template #label>
					<div class="align-items-center d-flex justify-content-between">
						<h6 class="mb-0">Munkalap leírása</h6>
						<b-badge variant="secondary">{{ (sheet.description || '').length }} / 1000</b-badge>
					</div>
				</template>
				<b-textarea
					v-model="sheet.description"
					maxlength="1000"
					rows="6"
				/>
			</b-form-group>
			<b-form-group v-if="sheet.survey">
				<template #label>
					<h6 class="mb-0">Kérdőív</h6>
				</template>
				<SurveyEditor
					v-if="JSON.parse(sheet.survey).demographic"
					:value="demographicSurvey"
					:readonly="true"
				/>
				<SurveyEditor
					v-else
					v-model="sheet.survey"
				/>
			</b-form-group>
			<b-form-group v-else>
				<template #label>
					<h6 class="mb-0">Látogatói interakciók</h6>
				</template>
				<b-form-checkbox
					v-if="!sheet.features"
					v-model="socialButtons"
				>
					Megosztás gombok
				</b-form-checkbox>
			</b-form-group>
		</AdminSidebar>
		<!--<EditorNavbar
			v-if="!visitor"
			:title-name="project.title"
			:title-extra-html-content="` - <nobr>${sheet.ord + 1} / ${project.sheets.length}</nobr>`"
			:dynamic-title="false"
		>
			<template #back-button-name>{{ project.title }}</template>
		</EditorNavbar>-->
		<!--<MapEditor
			v-if="sheet.features"
			:features="loadInitFeatures()"
			:visitor="visitor"
		>
			<template #feature-editor>
				<FeatureListContainer
					:visitor="visitor"
					:available-visitor-drawing-interactions="sheet.interactions"
					:init-feature-ratings="initFeatureRatings"
					@addVisitorDrawingInteractions="addVisitorDrawingInteractions"
				/>
			</template>
		</MapEditor>-->
		<!--<div class="sheet-sidebar">
			<b-sidebar
				id="sheet-sidebar"
				visible
				left
				no-header
				@change="showBottomNav = !showBottomNav"
			>
				<SheetEditor
					:sheet="sheet"
					:next-btn-shown="nextSheetExists()"
					:prev-btn-shown="prevSheetExists()"
					:visitor="visitor"
					:terms-and-use-accepted="termsAndUseAccepted"
					:submitted="submitted"
					@sheetInteractionsChanged="changeSheetInteractions"
					@sheetSurveyChanged="changeSheetSurvey"
					@prevSheet="goToOtherSheet(-1)"
					@nextSheet="goToOtherSheet(1)"
					@collapse="handleCollapse"
					@uploadImage="uploadImage"
					@backgroundImageDeleted="update"
					@toggleTermsAndUseAccepted="toggleTermsAndUseAccepted"
					@submit="submit"
				/>
			</b-sidebar>
			<div
				ref="sidebar-expand"
				class="sidebar-button sidebar-expand"
			>
				<a
					v-b-toggle.sheet-sidebar
					href="#"
				>
					<svg
						width="14"
						height="150"
					>
						<path
							d=" M 0 150 L 13 135 L 13 15 L 0 0"
							fill="rgb(247,247,247)"
							stroke="rgb(223,223,223)"
						/>
						<path d="M 0 0 L 0 150" />
					</svg>
				</a>
				<span class="material-icons collapse-icon">
					expand_less
				</span>
			</div>
		</div>-->
		<!--<b-navbar
			v-if="showBottomNav"
			class="justify-content-between fixed-bottom border-top"
			type="light"
			variant="white"
		>
			<b-navbar-nav>
				<div v-if="prevSheetExists()">
					<b-button
						variant="outline-secondary"
						:disabled="submitted"
						@click="goToOtherSheet(-1)"
					>
						<i class="fas fa-chevron-left mr-1" />
						<span class="d-none d-lg-inline">{{ getByOrd(sheet.ord - 1).title }}</span>
					</b-button>
				</div>
			</b-navbar-nav>
			<b-navbar-nav>
				<div>
					<b-button
						v-if="nextSheetExists()"
						variant="primary"
						:disabled="nextButtonDisabled"
						@click="goToOtherSheet(1)"
					>
						<span class="d-none d-md-inline">{{ getByOrd(sheet.ord + 1).title }}</span>
						<i class="fas fa-chevron-right ml-1" />
					</b-button>
					<b-button
						v-else-if="visitor"
						variant="success"
						:disabled="nextButtonDisabled || submitted"
						@click="submit"
					>
						Küldés
						<i class="fas fa-paper-plane ml-1" />
					</b-button>
				</div>
			</b-navbar-nav>
		</b-navbar>-->
	</div>
</template>

<script>
import GeoJSON from 'ol/format/GeoJSON';
import { mapGetters } from 'vuex';

const SOCIAL_SHARING = 'SocialSharing';

export default {
	props: {
		sheetOrd: {
			type: String,
			required: true,
		},
		project: {
			type: Object,
			required: true,
		},
		visitor: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		const sheet = this.project.sheets.filter(
			sheet => sheet.ord === parseInt(this.sheetOrd)
		)[0];

		const socialButtons = ((this.sheet || {}).interactions || '').includes(
			SOCIAL_SHARING
		);

		return {
			contentModified: false,
			imageSource: null,
			initFeatureRatings: null,
			localVisitorFeatureRatings: {},
			localVisitorFeatures: [],
			sheet,
			socialButtons,
			showBottomNav: false,
			submitted: false,
			termsAndUseAccepted: this.visitor ? 'not_accepted' : null,
		};
	},
	computed: {
		...mapGetters({
			getAllFeature: 'features/getAllFeature',
			getVisitorFeatures: 'visitordata/getVisitorFeatures',
			getVisitorRatings: 'visitordata/getVisitorRatings',
			getSubmissionData: 'visitordata/getSubmissionData',
		}),
		nextButtonDisabled() {
			if (this.visitor && this.firstSheet()) {
				return this.termsAndUseAccepted === 'not_accepted';
			} else {
				return false;
			}
		},
	},
	watch: {
		sheet: {
			handler() {
				this.$nuxt.$emit('contentModified');
			},
			deep: true,
		},
		socialButtons(val) {
			if (!this.sheet) {
				return;
			}
			const i = JSON.parse(this.sheet.interactions || '[]');
			if (val) {
				i.push(SOCIAL_SHARING);
				this.sheet.interactions = JSON.stringify(i);
			} else {
				this.sheet.interactions = JSON.stringify(
					i.filter(e => e !== SOCIAL_SHARING)
				);
			}
		},
	},
	created() {
		this.$nuxt.$on('contentModified', () => {
			this.contentModified = true;
		});
		this.$nuxt.$on('visitorFeatureAdded', feature => {
			this.localVisitorFeatures.push(feature);
		});
		this.$nuxt.$on('visitorFeatureRemoved', feature => {
			const idx = this.localVisitorFeatures.indexOf(feature);
			if (idx !== -1) {
				this.localVisitorFeatures.splice(idx, 1);
			}
		});
		this.$nuxt.$on('featureRatedByVisitor', (featureId, rating) => {
			this.localVisitorFeatureRatings[featureId.toString()] = rating;
		});
	},
	async mounted() {
		this.initFeatureRatings = await this.loadInitFeatureRatings();
	},
	beforeDestroy() {
		this.$nuxt.$off('contentModified');
		this.$nuxt.$off('visitorFeatureAdded');
		this.$nuxt.$off('visitorFeatureRemoved');
		this.$nuxt.$off('featureRatedByVisitor');
	},
	methods: {
		async submit() {
			this.submitted = true;
			this.storeLocalVisitorFeatures();
			this.storeLocalVisitorFeatureRatings();
			const sheetIds = this.project.sheets.map(s => s.id);
			const data = this.getSubmissionData(sheetIds);
			if (Object.keys(data).length) {
				await this.$axios.$post('/api/submission/' + this.project.id, data);
			} else {
				this.submitted = false;
			}
		},
		async update(localSheet) {
			try {
				const sheet = await this.$axios.$patch('/api/sheet', localSheet);
				this.sheet = sheet;
				this.success('Módosítás sikeres.');
			} catch (error) {
				this.errorToast('Módosítás sikertelen.');
			}
		},
		async uploadImage(image) {
			const formData = new FormData();
			formData.append('image', image);
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
			} catch (error) {
				this.errorToast('Kép feltöltése sikertelen.');
			}
		},
		changeSheetInteractions(val) {
			this.sheet.interactions = val;
		},
		changeSheetSurvey(val) {
			this.sheet.survey = val;
		},
		goBackToProject() {
			const route = '/admin/project/' + this.project.id;
			if (this.contentModified) {
				this.showConfirmModal(route);
			} else {
				this.$router.push(route);
			}
		},
		/**
		 * Gets sheet from DB by its order instead of is
		 * @returns {Object} sheet
		 */
		getByOrd(ord) {
			const sheet = this.project.sheets.filter(sheet => {
				return sheet.ord === ord;
			});
			return sheet[0];
		},
		/**
		 * @param {int} orderDiff - new sheet order = order + orderDiff
		 */
		goToOtherSheet(orderDiff) {
			if (this.visitor && this.sheet.interactions) {
				this.storeLocalVisitorFeatures();
			}
			if (Object.keys(this.localVisitorFeatureRatings).length) {
				this.storeLocalVisitorFeatureRatings();
			}
			// change only the last part of the route which indicates the sheet order
			const fullPath = this.$route.fullPath;
			const route =
				fullPath.slice(0, fullPath.lastIndexOf('/') + 1) +
				(parseInt(this.sheetOrd) + orderDiff);
			if (this.contentModified && !this.visitor) {
				this.showConfirmModal(route);
			} else {
				this.$router.push(route);
			}
		},
		storeLocalVisitorFeatures() {
			const payload = {
				features: this.localVisitorFeatures,
				sheetId: this.sheet.id,
			};
			this.$store.commit('visitordata/addFeatures', payload);
		},
		storeLocalVisitorFeatureRatings() {
			const payload = {
				ratings: this.localVisitorFeatureRatings,
				sheetId: this.sheet.id,
			};
			this.$store.commit('visitordata/addRatings', payload);
		},
		prevSheetExists() {
			return !!this.getByOrd(this.sheet.ord - 1);
		},
		nextSheetExists() {
			return !!this.getByOrd(this.sheet.ord + 1);
		},
		firstSheet() {
			return this.sheetOrd === '0';
		},
		handleCollapse(collapseBtn) {
			this.$root.$emit('bv::toggle::collapse', 'sheet-sidebar');
			// place the expand button the same position as the collapse button
			const topPos = collapseBtn.getBoundingClientRect().top;
			this.$refs['sidebar-expand'].style.transform = `translateY(${topPos}px)`;
			this.$refs['sidebar-expand'].style.visibility = 'visible';
		},
		loadFeaturesFromStore() {
			const features = [];
			for (const f of this.getAllFeature) {
				const featureStr = new GeoJSON().writeFeature(f);
				features.push(JSON.parse(featureStr));
			}
			this.sheet.features = features.length ? features : [];
		},
		featuresFromRaw(featuresRaw) {
			const features = JSON.parse(featuresRaw);
			const featureCollection = { type: 'FeatureCollection', features };
			return features ? new GeoJSON().readFeatures(featureCollection) : null;
		},
		loadInitFeatures() {
			const adminFeatures = this.featuresFromRaw(this.sheet.features);
			const visitorFeatures = this.getVisitorFeatures(this.sheet.id) || [];
			this.localVisitorFeatures = [...visitorFeatures];
			return [...visitorFeatures, ...adminFeatures];
		},
		async loadInitFeatureRatings() {
			if (this.visitor) {
				const visitorRatings = this.getVisitorRatings(this.sheet.id) || [];
				this.localVisitorFeatureRatings = { ...visitorRatings };
				return { ...visitorRatings };
			} else {
				let submittedRatings = {};
				try {
					submittedRatings = await this.$axios.$get(
						'/api/submission/ratings/' + this.sheet.id
					);
				} catch (error) {}
				return submittedRatings;
			}
		},
		saveMap() {
			if (this.sheet.features) {
				this.loadFeaturesFromStore();
			}
			this.update(this.sheet);
			this.contentModified = false;
		},
		addVisitorDrawingInteractions(interactions) {
			this.sheet.interactions = interactions;
			this.contentModified = true;
		},
		/**
		 * @param {string} route - redirect route upon modal close
		 */
		showConfirmModal(route) {
			this.$bvModal
				.msgBoxConfirm(
					'Önnek nem mentett módosításai vannak. Kívánja őket menteni?',
					{
						title: 'Visszalépés',
						size: 'sm',
						buttonSize: 'sm',
						okVariant: 'danger',
						okTitle: 'Igen',
						cancelTitle: 'Nem',
						footerClass: 'p-2',
						hideHeaderClose: false,
						centered: true,
						autoFocusButton: 'ok',
					}
				)
				.then(value => {
					if (value === true) {
						this.saveMap();
						this.$router.push(route);
					} else if (value === false) {
						this.$router.push(route);
					} // Do nothing on window close or backdrop click
				})
				.catch(() => {
					this.errorToast('Sikertelen mentés');
				});
		},
		toggleTermsAndUseAccepted(val) {
			this.termsAndUseAccepted = val;
		},
	},
};
</script>

<style>
#sheet-sidebar {
	border-radius: 0.25rem;
	height: auto;
	top: 120px;
}
</style>
