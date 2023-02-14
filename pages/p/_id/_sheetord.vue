<template>
	<SheetFrame v-if="project && sheet" :background-image-url="sheet.image">
		<form ref="sheetForm" @submit.prevent="">
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
							v-b-tooltip.hover.bottom
							:href="localePath({ name: 'hogyan-mukodik' })"
							target="_blank"
							:title="$t('PublicFrame.help')"
						>
							<Logo />
						</a>
						<a :href="project.user.website" target="_blank">
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
						:show-submit="
							getConsent && isLastSheet && !needToShowResults
						"
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
						:key="$route.path"
						:features="loadInitFeatures()"
						:initial-base-map-key="interactions.baseMap"
						visitor
						@visitorFeatureAdded="addVisitorFeature"
						@visitorFeatureRemoved="delVisitorFeature"
					/>
					<template #placeholder>
						<div class="h-100 position-absolute w-100 map" />
					</template>
				</client-only>
				<MapHint />
				<Sidebar
					:content-modified="!submitted"
					:fixed="!sheet.features"
					:loading="loading"
					:project="project"
					:show-next="!isLastSheet || needToShowResults"
					:show-prev="!isFirstSheet && !submitted"
					:show-submit="
						getConsent && isLastSheet && !needToShowResults
					"
					:step="sheet.ord + 1"
					:steps="project.sheets.length"
					@next="next"
					@prev="prev"
					@submit="submit"
				>
					<b-navbar class="m-0 mb-4 p-0">
						<h1 class="h3 m-0">{{ sheet.title }}</h1>
					</b-navbar>

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
						:init-feature-ratings="featureRatings"
						:hide-admin-features="!!isInteractive"
						:show-results="resultsShown"
						:stars="stars"
						visitor
						:visitor-can-rate="
							interactions.enabled.includes('Rating')
						"
					/>
				</Sidebar>
			</div>
		</form>
		<b-modal
			id="privacy-modal"
			hide-footer
			scrollable
			size="lg"
			:title="$t('sheet.privacyPolicy')"
		>
			<Terms :project-data-processor="project.privacyPolicy" />
		</b-modal>
	</SheetFrame>
	<div v-else class="container d-flex flex-column flex-grow-1">
		<div class="row flex-grow-1">
			<div class="col col-sm-10 col-md-8 col-lg-6 m-auto">
				<form @submit.prevent="sendPassword">
					<div class="card m-3 shadow-sm">
						<h5 class="card-header">Partimap</h5>
						<div class="card-body">
							<p>{{ $t('sheet.restricted') }}</p>
							<p>{{ $t('sheet.passwordRequired') }}</p>
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
										:placeholder="$t('sheet.password')"
										type="password"
									/>
								</b-input-group>
							</div>
						</div>
						<div class="card-footer text-right">
							<button class="btn btn-primary">
								{{ $t('sheet.view') }}
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
import { deserializeInteractions } from '~/assets/interactions';

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
			const interactions = deserializeInteractions(sheet?.interactions);
			return { project, sheet, interactions };
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
			title: this.project
				? this.project.title
				: this.$t('sheet.restrictedTitle'),
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
						: `${this.$config.baseURL}/ogimage.png`,
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
		featureRatings() {
			return this.resultsShown
				? this.sheet.ratings
				: this.getVisitorRatings(this.sheet.id);
		},
		isFirstSheet() {
			return this.sheet.ord === 0;
		},
		isLastSheet() {
			return this.sheet.ord === this.project.sheets.length - 1;
		},
		isInteractive() {
			return (
				this.interactions.enabled.includes('Point') ||
				this.interactions.enabled.includes('LineString') ||
				this.interactions.enabled.includes('Polygon')
			);
		},
		needToShowResults() {
			const haveAnswers = this.sheet.answers.length > 0;
			const haveRatings =
				this.sheet.ratings &&
				Object.keys(this.sheet.ratings).length > 0;
			const haveResults = haveAnswers || haveRatings;
			return haveResults && !this.resultsShown;
		},
		stars() {
			return this.interactions.stars;
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
		this.$store.commit('selected/clear');
		this.loading = false;
	},
	created() {
		this.$nuxt.$on('featureRatedByVisitor', (featureId, rating) => {
			const ratings = this.getVisitorRatings(this.sheet.id) || {};
			if (rating) {
				ratings[featureId] = rating;
			} else {
				// zero or empty
				delete ratings[featureId];
			}
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
			return features
				? new GeoJSON().readFeatures(featureCollection)
				: [];
		},
		goToSheetOrd(ord) {
			this.$router.push(
				this.$route.fullPath.replace(/[?#].*$/, '').replace(/\d+$/, ord)
			);
		},
		loadInitFeatures() {
			const adminFeatures = this.featuresFromRaw(this.sheet.features);
			if (this.isInteractive) {
				// on interactive sheets, admin features cannot be selected
				adminFeatures.forEach(f => f.set('hidden', true));
			}

			const visitorFeatures =
				this.getVisitorFeatures(this.sheet.id) || [];

			// adding "rating" to feature objects for map graying effect
			const visitorRatings = this.getVisitorRatings(this.sheet.id) || {};
			adminFeatures.forEach(f => {
				const r = visitorRatings[f.getId()];
				if (r) {
					f.set('rating', r);
				}
			});

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
				if (
					error.message &&
					error.message.endsWith('status code 401')
				) {
					this.errorToast(this.$t('sheet.invalidPassword'));
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
					await this.$axios.$post(
						'/api/submission/' + this.project.id,
						{
							...data,
							captcha,
						}
					);
					this.$store.commit('setSubmitted');
					this.success(this.$t('sheet.submitSuccess'));
				} catch {
					this.errorToast(this.$t('sheet.submitFailed'));
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
