<template>
	<SheetFrame
		v-if="project && sheet"
		:background-image-url="sheet.image"
	>
		<form
			ref="sheetForm"
			submit.prevent=""
		>
			<b-modal
				v-if="!sheet.features"
				content-class="shadow-sm"
				footer-class="d-flex p-0"
				hide-backdrop
				no-close-on-backdrop
				no-close-on-esc
				no-fade
				scrollable
				static
				visible
			>
				<template #modal-header>
					<div class="d-flex justify-content-between w-100">
						<a
							href="/"
							target="_blank"
						>
							<Logo />
						</a>
						<a
							:href="project.user.website"
							target="_blank"
						>
							<img
								v-if="project.user.logo"
								:src="project.user.logo"
								:alt="project.user.website"
								height="30"
							>
						</a>
					</div>
				</template>
				<SheetContent
					:project="project"
					:results="resultsShown"
					:sheet="sheet"
					:show-consent="isFirstSheet"
				/>
				<LoadingOverlay :show="loading" />
				<template #modal-footer>
					<FooterButtons
						:disable-submit="loading || !getConsent || submitted"
						:show-next="!isLastSheet || needToShowResults"
						:show-prev="!isFirstSheet && !submitted"
						:show-submit="getConsent && isLastSheet && !needToShowResults"
						:step="sheet.ord + 1"
						:steps="project.sheets.length"
						@next="next"
						@prev="prev"
						@submit="submit"
					/>
				</template>
			</b-modal>
			<div v-else>
				<client-only>
					<Map
						:features="loadInitFeatures()"
						visitor
						@visitorFeatureAdded="addVisitorFeature"
						@visitorFeatureRemoved="delVisitorFeature"
					/>
					<template #placeholder>
						<div class="h-100 position-absolute w-100 map" />
					</template>
				</client-only>
				<MapToolbar
					:sheet="sheet"
					visitor
				/>
				<Sidebar
					:content-modified="!submitted"
					:fixed="!sheet.features"
					:loading="loading"
					:project="project"
					:show-next="!isLastSheet || needToShowResults"
					:show-prev="!isFirstSheet && !submitted"
					:show-submit="getConsent && isLastSheet && !needToShowResults"
					:step="sheet.ord + 1"
					:steps="project.sheets.length"
					@next="next"
					@prev="prev"
					@submit="submit"
				>
					<h1 class="h3">{{ sheet.title }}</h1>

					<div v-if="isInteractive">
						<b-alert
							class="my-3 small"
							show
							variant="info"
						>
							<p class="d-sm-none">
								A térkép megtekintéséhez ezt a panelt be kell csukni, a képernyő tetején levő <i class="fas fa-angle-double-left mx-1" /> gombbal.
							</p>
							<p>
								A jobb oldali ikonokkal lehet a térképre rajzolni. A szakaszokat kattintással lehet kijelölni, rajzolás közben az egeret nem kell nyomva tartani. Egy útszakaszt dupla kattintással lehet lezárni. A hibás elem a kuka ikonra kattintva törölhető.
							</p>
						</b-alert>
					</div>
					<div v-else>
						<b-alert
							class="d-sm-none my-3 small"
							show
							variant="info"
						>
							A térkép megtekintéséhez ezt a panelt be kell csukni, a képernyő tetején levő <i class="fas fa-angle-double-left mx-1" /> gombbal.
						</b-alert>
					</div>

					<SheetContent
						class="mb-3"
						hide-title
						:project="project"
						:results="resultsShown"
						:sheet="sheet"
						:show-consent="isFirstSheet"
					/>
					<FeatureList
						:description-label="sheet.descriptionLabel"
						:init-feature-ratings="getVisitorRatings(sheet.id)"
						:hide-admin-features="isInteractive"
						visitor
						:visitor-can-rate="(sheet.interactions || '').includes('Rating')"
					/>
				</Sidebar>
			</div>
		</form>
		<b-modal
			id="privacy-modal"
			hide-footer
			scrollable
			size="lg"
			title="Felhasználási feltételek és adatvédelmi nyilatkozat"
		>
			<Terms :project-data-processor="project.privacyPolicy" />
		</b-modal>
	</SheetFrame>
	<div
		v-else
		class="container d-flex flex-column flex-grow-1"
	>
		<div class="row flex-grow-1">
			<div class="col col-sm-10 col-md-8 col-lg-6 m-auto">
				<form @submit.prevent="sendPassword">
					<div class="card m-3 shadow-sm">
						<h5 class="card-header">Partimap</h5>
						<div class="card-body">
							<p>Ez a projekt jelszóval védett.</p>
							<p>Kérlek írd be a jelszót a megtekintéshez!</p>
							<div class="form-group">
								<b-input-group>
									<template #prepend>
										<b-input-group-text>
											<i class="fas fa-key fa-fw" />
										</b-input-group-text>
									</template>
									<b-form-input
										ref="password"
										v-model="password"
										placeholder="Jelszó"
										type="password"
									/>
								</b-input-group>
							</div>
						</div>
						<div class="card-footer text-right">
							<button class="btn btn-primary">
								Megtekintés
								<i class="fas fa-sign-in-alt ml-1" />
							</button>
						</div>
						<LoadingOverlay :show="loading" />
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import GeoJSON from 'ol/format/GeoJSON';
import { mapGetters } from 'vuex';

export default {
	components: {
		Map: () => (process.client ? import('@/components/Map') : null),
	},
	async asyncData({ $axios, store, params, redirect }) {
		if (params.sheetord > 0 && !store.state.visitId) {
			// before visitId generation, so it's a manual navigation
			return redirect(`/p/${params.id}/0`);
		}
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
			const sheet = project.sheets[params.sheetord]; // sheets are ordered on server
			return { project, sheet };
		} catch (error) {
			if (error.message && error.message.endsWith('status code 401')) {
				// displaying password field
				// returning received minimal project metadata
				return { project: error.response.data };
			} else {
				redirect('/');
			}
		}
	},
	data() {
		return {
			loading: true,
			password: null,
			project: null, // do not delete, required by SSR
			resultsShown: false,
			sheet: null,
		};
	},
	head() {
		return {
			title: this.project ? this.project.title : 'Jelszóval védett projekt',
			meta: [
				{
					hid: 'description',
					name: 'description',
					content: this.project ? this.project.description : null,
				},
				{
					hid: 'og:image',
					property: 'og:image',
					content: this.project.image
						? `${this.$config.baseURL}${this.project.image}`
						: null, // TODO use Partimap logo/ogimage otherwise
				},
			],
		};
	},
	computed: {
		submitted() {
			return this.$store.state.submitted;
		},
		...mapGetters(['getConsent']),
		...mapGetters('features', ['getAllFeature']),
		...mapGetters('selected', ['getSelectedFeature']),
		...mapGetters('visitordata', [
			'getVisitorFeatures',
			'getVisitorRatings',
			'getSubmissionData',
		]),
		isFirstSheet() {
			return this.sheet.ord === 0;
		},
		isLastSheet() {
			return this.sheet.ord === this.project.sheets.length - 1;
		},
		isInteractive() {
			return (this.sheet.interactions || '').replace('Rating', '').length > 5;
		},
		needToShowResults() {
			return this.sheet.answers.length > 0 && !this.resultsShown;
		},
	},
	watch: {
		getSelectedFeature(f) {
			if (f && (f.get('visitorFeature') || !this.isInteractive)) {
				this.$store.commit('setSidebarVisible', true);
			}
		},
	},
	async mounted() {
		this.registerHit();
		if (!this.project) {
			this.$refs.password.focus();
			await this.$recaptcha.init();
		} else {
			const survey = JSON.parse(this.sheet?.survey || '{}');
			if (survey.showResultsOnly) {
				this.resultsShown = true;
			}
		}
		this.loading = false;
	},
	created() {
		this.$nuxt.$on('featureRatedByVisitor', (featureId, rating) => {
			const ratings = this.getVisitorRatings(this.sheet.id) || {};
			ratings[featureId] = rating;
			const payload = { ratings, sheetId: this.sheet.id };
			this.$store.commit('visitordata/addRatings', payload);
		});
	},
	beforeDestroy() {
		this.$nuxt.$off('featureRatedByVisitor');
		this.$recaptcha.destroy();
	},
	methods: {
		addVisitorFeature(feature) {
			const features = this.getVisitorFeatures(this.sheet.id) || [];
			features.push(feature);
			const payload = { features, sheetId: this.sheet.id };
			this.$store.commit('visitordata/addFeatures', payload);
		},
		delVisitorFeature(feature) {
			const features = this.getVisitorFeatures(this.sheet.id) || [];
			const idx = features.indexOf(feature);
			if (idx !== -1) {
				features.splice(idx, 1);
				const payload = { features, sheetId: this.sheet.id };
				this.$store.commit('visitordata/addFeatures', payload);
			}
		},
		featuresFromRaw(featuresRaw) {
			const features = JSON.parse(featuresRaw);
			const featureCollection = { type: 'FeatureCollection', features };
			return features ? new GeoJSON().readFeatures(featureCollection) : [];
		},
		goToSheetOrd(ord) {
			this.$router.push(
				this.$route.fullPath.replace(/[?#].*$/, '').replace(/\d+$/, ord)
			);
		},
		loadInitFeatures() {
			const adminFeatures = this.featuresFromRaw(this.sheet.features);
			const visitorFeatures = this.getVisitorFeatures(this.sheet.id) || [];
			return [...visitorFeatures, ...adminFeatures];
		},
		next() {
			if (this.$refs.sheetForm.reportValidity()) {
				if (this.needToShowResults) {
					this.resultsShown = true;
				} else {
					this.goToSheetOrd(this.sheet.ord + 1);
				}
			}
		},
		prev() {
			this.goToSheetOrd(this.sheet.ord - 1);
		},
		registerHit() {
			if (
				this.project &&
				!this.$store.state.hit &&
				Number(this.$route.params.sheetord) === 0
			) {
				this.$store.commit('hit');
				this.$axios.$post('/api/view/' + this.$route.params.id);
			}
		},
		async sendPassword() {
			this.loading = true;
			const { password } = this;
			const projectId = this.$route.params.id;
			const visitId = this.$store.state.visitId;
			try {
				const captcha = await this.$recaptcha.execute('access');
				this.project = await this.$axios.$post('/api/project/access', {
					password,
					projectId,
					visitId,
					captcha,
				});
				this.sheet = this.project.sheets[this.$route.params.sheetord];
				this.registerHit();
			} catch (error) {
				if (error.message && error.message.endsWith('status code 401')) {
					this.errorToast('Érvénytelen jelszó!');
				} else {
					throw error; // let Nuxt handle it
				}
			} finally {
				this.password = null;
				this.$refs.password.focus();
				this.loading = false;
			}
		},
		async submit() {
			if (!this.$refs.sheetForm.reportValidity()) {
				return;
			}
			this.loading = true;
			const sheetIds = this.project.sheets.map(s => s.id);
			const data = this.getSubmissionData(sheetIds);
			if (Object.keys(data).length) {
				try {
					const captcha = await this.$recaptcha.execute('submit');
					await this.$axios.$post('/api/submission/' + this.project.id, {
						...data,
						captcha,
					});
					this.$store.commit('setSubmitted');
					this.success('Beküldés sikeres.');
				} catch {
					this.errorToast('Beküldés sikertelen.');
				}
			}
			this.loading = false;
		},
	},
};
</script>

<style scoped>
.alert p:last-child {
	margin-bottom: 0;
}
</style>
