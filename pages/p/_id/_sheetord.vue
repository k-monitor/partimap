<template>
	<SheetFrame
		v-if="project && sheet"
		:background-image-url="sheet.image"
		:class="{ branded: !!project.user.color }"
		:style="`--brand: ${project.user.color || '#007bff'}`"
	>
		<form
			ref="sheetForm"
			@submit.prevent=""
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
							v-b-tooltip.hover.bottom
							:href="localePath({ name: 'hogyan-mukodik' })"
							target="_blank"
							:title="$t('PublicFrame.help')"
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
							/>
						</a>
					</div>
				</template>
				<SheetContent
					:brand-color="project.user.color"
					:project="project"
					:results="resultsShown"
					:results-data="resultsData"
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
						fit-selected
						:gray-rated="!resultsShown"
						:initial-base-map-key="interactions.baseMap"
						:labels="labels"
						visitor
						@visitorFeatureAdded="addVisitorFeature"
						@visitorFeatureRemoved="delVisitorFeature"
					/>
					<template #placeholder>
						<div class="h-100 position-absolute w-100 map" />
					</template>
				</client-only>
				<MapToolbar v-if="!!getDrawType" />
				<MapTask :interactions="interactions" />
				<MapHint />
				<Sidebar
					:fixed="!sheet.features"
					:loading="loading"
					:project="project"
				>
					<SheetContent
						:brand-color="project.user.color"
						class="mb-3"
						:project="project"
						:results="resultsShown"
						:results-data="resultsData"
						:sheet="sheet"
						:show-consent="isFirstSheet"
					/>
					<FeatureList
						v-if="!submitted"
						:show-results="resultsShown"
						:is-interactive="isInteractive"
						is-on-sheet-view
						visitor
					/>

					<template #footer>
						<FooterButtons
							:disable-submit="
								loading || !getConsent || submitted
							"
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
	<div
		v-else
		class="container d-flex flex-column flex-grow-1"
	>
		<div class="row flex-grow-1">
			<div class="col col-sm-10 col-md-8 col-lg-6 m-auto">
				<form @submit.prevent="sendPassword">
					<div class="card m-3 shadow-sm">
						<h5 class="card-header">PARTIMAP</h5>
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
import { canShowQuestion } from '~/assets/questionUtil';

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
	async asyncData({ $auth, $axios, params, redirect, route, store }) {
		const forcedSheetOrd = $auth.user && !!route.query.force;
		if (params.sheetord > 0 && !store.state.visitId && !forcedSheetOrd) {
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
		...mapGetters(['getConsent', 'getDrawType']),
		...mapGetters('features', ['getAllFeature']),
		...mapGetters('visitordata', [
			'getAllVisitorAnswers',
			'getVisitorAnswers',
			'getVisitorFeatures',
			'getVisitorRatings',
			'getSubmissionData',
		]),
		availableSheetOrds() {
			return this.project.sheets
				.filter(sheet => {
					if (!sheet.survey) return true;
					const { questions } = JSON.parse(sheet.survey);
					if (!questions || !questions.length) return true;
					const questionsAvailable = !!questions?.find(q => {
						return canShowQuestion(q, this.getAllVisitorAnswers);
					});
					return questionsAvailable;
				})
				.map(sheet => sheet.ord);
		},
		nextSheetOrd() {
			return this.availableSheetOrds.find(o => o > this.sheet.ord);
		},
		prevSheetOrd() {
			const ords = [...this.availableSheetOrds];
			ords.reverse();
			return ords.find(o => o < this.sheet.ord);
		},
		isFirstSheet() {
			return typeof this.prevSheetOrd === 'undefined';
		},
		isLastSheet() {
			return typeof this.nextSheetOrd === 'undefined';
		},
		isInteractive() {
			return (
				this.interactions.enabled.includes('Point') ||
				this.interactions.enabled.includes('LineString') ||
				this.interactions.enabled.includes('Polygon')
			);
		},
		labels() {
			const labels = {};
			if (!this.resultsShown || !this.sheet || !this.sheet.ratings)
				return labels;
			Object.entries(this.sheet.ratings || {}).forEach(([id, r]) => {
				if (this.interactions.stars === -2) {
					labels[id] = `👍 ${r.likeCount} 👎 ${Math.abs(
						r.dislikeCount
					)}`;
				} else {
					const avg = Math.round(r.average * 10) / 10;
					labels[id] = `⭐ ${Number(avg).toFixed(1)}`;
				}
			});
			return labels;
		},
		showOnlyResults() {
			const survey = JSON.parse(this.sheet?.survey || '{}');
			return (
				this.interactions?.enabled?.includes('ShowResultsOnly') ||
				survey.showResultsOnly
			);
		},
		visitorAnswers() {
			return this.getVisitorAnswers(this.sheet?.id);
		},
		resultsData() {
			if (this.showOnlyResults) return this.sheet?.answers || [];
			// Show results for only those questions that has been answered.
			const answeredIds = Object.keys(this.visitorAnswers || {}).filter(
				id => !!this.visitorAnswers[id]
			);
			return (
				this.sheet?.answers?.filter(e =>
					answeredIds.includes(String(e.questionId))
				) || []
			);
		},
		needToShowResults() {
			// We will show results if we got results from server.
			// Server knows when to include results based on sheet settings.
			if (!this.sheet) return false;
			const haveAnswers = this.resultsData.length > 0;
			const haveRatings =
				this.sheet.ratings &&
				Object.keys(this.sheet.ratings).length > 0;
			const haveResults = haveAnswers || haveRatings;
			return haveResults && !this.resultsShown;
		},
	},
	async mounted() {
		this.registerHit();
		if (!this.project) {
			this.$refs.password.focus();
			await this.$recaptcha.init();
		} else if (this.needToShowResults && this.showOnlyResults) {
			this.resultsShown = true;
		}
		this.$store.commit('selected/clear');
		this.loading = false;

		console.log(
			'PUBLIC SHEET sheet.ratings',
			JSON.stringify(this.sheet.ratings)
		);
	},
	beforeDestroy() {
		this.$recaptcha.destroy();
	},
	methods: {
		addVisitorFeature(feature) {
			const features = this.getVisitorFeatures(this.sheet.id) || [];

			const cat = this.$t(
				'FeatureListElement.defaultName.' +
					feature.getGeometry().getType()
			);
			feature.set('category', cat);

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

			// adding "rating" to feature objects for graying effect on map and in FLE header
			const visitorRatings = this.getVisitorRatings(this.sheet.id) || {};
			adminFeatures.forEach(f => {
				const ratingObj = visitorRatings[f.getId()];
				if (ratingObj?.value) f.set('rating', ratingObj.value);
			});

			return [...visitorFeatures, ...adminFeatures];
		},
		next() {
			this.$store.commit('selected/clear');
			const sidebar =
				document.getElementsByClassName('b-sidebar-body')[0];
			if (sidebar) sidebar.scrollTop = 0;
			if (!this.$refs.sheetForm.reportValidity()) {
				return;
			}
			if (this.needToShowResults) {
				this.resultsShown = true;
			} else {
				this.goToSheetOrd(this.nextSheetOrd);
			}
		},
		prev() {
			this.goToSheetOrd(this.prevSheetOrd);
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
			this.$store.commit('selected/clear');
			const sidebar =
				document.getElementsByClassName('b-sidebar-body')[0];
			if (sidebar) sidebar.scrollTop = 0;
			if (!this.$refs.sheetForm.reportValidity()) {
				return;
			}
			this.loading = true;
			const sheetIds = this.project.sheets.map(s => s.id);
			const data = this.getSubmissionData(sheetIds);
			if (Object.keys(data).length) {
				this.injectDataIntoFeatures(data);
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
		injectDataIntoFeatures(data) {
			const questions = {};
			const answers = {};

			// gather questions and answers to inject
			const str = v => (Array.isArray(v) ? v.join(', ') : v || '');
			this.project.sheets.forEach(sheet => {
				try {
					const qs = JSON.parse(sheet.survey).questions;
					qs.filter(q => q.addToFeatures).forEach(q => {
						const ans = data[sheet.id]?.answers[q.id];
						if (Object.isExtensible(ans) && !Array.isArray(ans)) {
							// answer is {...}, so a matrix -> injecting rows separately
							Object.keys(ans).forEach((k, i) => {
								const qak = `${q.id}_${i}`;
								questions[qak] = `${q.label} [${k}]`;
								answers[qak] = str(ans[k]);
							});
						} else {
							questions[q.id] = q.label;
							answers[q.id] = str(ans);
						}
					});
				} catch {}
			});

			// inject into features
			Object.keys(data).forEach(sid => {
				const features = data[sid].features;
				if (!features) return;
				for (let i = 0; i < features.length; i++) {
					const f = features[i];
					Object.keys(questions).forEach(qid => {
						f.properties[`partimapQuestion_${qid}`] =
							questions[qid];
						f.properties[`partimapQuestion_${qid}_ans`] =
							answers[qid];
					});
				}
			});
		},
	},
};
</script>

<style scoped>
.alert p:last-child {
	margin-bottom: 0;
}
</style>
