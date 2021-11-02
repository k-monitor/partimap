<template>
	<SheetFrame
		v-if="project"
		:background-image-url="sheet.image"
	>
		<b-modal
			v-if="!sheet.features"
			content-class="shadow-sm"
			footer-class="d-flex p-2"
			hide-backdrop
			hide-header
			no-close-on-backdrop
			no-close-on-esc
			no-fade
			scrollable
			static
			visible
		>
			<SheetContent
				:sheet="sheet"
				:show-consent="isFirstSheet"
			/>
			<client-only>
				<b-overlay
					no-wrap
					opacity="0.5"
					:show="loading"
				/>
			</client-only>
			<template #modal-footer>
				<FooterButtons
					:disable-submit="loading || !getConsent || submitted"
					:show-next="!isLastSheet && getConsent"
					:show-prev="!isFirstSheet && !submitted"
					:show-submit="isLastSheet && getConsent"
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
				:show-next="!isLastSheet && getConsent"
				:show-prev="!submitted"
				@next="next"
				@prev="prev"
				@submit="submit"
			>
				<b-alert
					class="d-sm-none small"
					show
					variant="info"
				>
					A térkép megtekintéséhez ezt a panelt be kell csukni, a képernyő tetején levő <i class="fas fa-times mx-1" /> gombbal. A kinyitáshoz a képernyő jobb szélén levő <i class="fas fa-info mx-1" /> gomb használható.
				</b-alert>
				<SheetContent
					:sheet="sheet"
					:show-consent="isFirstSheet"
				/>
				<b-alert
					class="small"
					:show="(sheet.interactions || '').replace('Rating', '').length > 5"
					variant="info"
				>
					A jobb szélen található színes ikonokkal lehet a térképre rajzolni. Vonal és terület rajzolásakor dupla kattintással kell az utolsó pontot jelezni.
				</b-alert>
				<FeatureList
					:init-feature-ratings="getVisitorRatings(sheet.id)"
					visitor
					:visitor-can-rate="(sheet.interactions || '').includes('Rating')"
				/>
			</Sidebar>
		</div>
		<b-modal
			id="privacy-modal"
			hide-footer
			scrollable
			title="Adatvédelmi nyilatkozat"
		>
			<p
				v-for="(p,i) in (project.privacyPolicy || '').split('\n')"
				:key="i + p"
				v-text="p"
			/>
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
						<div
							v-if="loading"
							class="bg-white d-flex h-100 position-absolute w-100"
						>
							<div
								class="m-auto spinner-border"
								role="status"
							>
								<span class="sr-only">Loading...</span>
							</div>
						</div>
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
				// NOP displaying password field
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
			sheet: null,
		};
	},
	head() {
		return {
			title: this.project ? this.project.title : 'Jelszóval védett projekt',
		};
	},
	computed: {
		submitted() {
			return this.$store.state.submitted;
		},
		...mapGetters(['getConsent']),
		...mapGetters('features', ['getAllFeature']),
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
	},
	mounted() {
		if (!this.project) {
			this.$refs.password.focus();
		}
		this.registerHit();
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
			this.$router.push(this.$route.fullPath.replace(/\d+$/, ord));
		},
		loadInitFeatures() {
			const adminFeatures = this.featuresFromRaw(this.sheet.features);
			const visitorFeatures = this.getVisitorFeatures(this.sheet.id) || [];
			return [...visitorFeatures, ...adminFeatures];
		},
		next() {
			this.goToSheetOrd(this.sheet.ord + 1);
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
				this.project = await this.$axios.$post('/api/project/access', {
					password,
					projectId,
					visitId,
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
			this.loading = true;
			const sheetIds = this.project.sheets.map(s => s.id);
			const data = this.getSubmissionData(sheetIds);
			if (Object.keys(data).length) {
				try {
					await this.$axios.$post('/api/submission/' + this.project.id, data);
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
