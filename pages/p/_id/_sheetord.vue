<template>
	<!--<Sheet
		v-if="project"
		:parent-project-data="project"
		:sheet-ord="$route.params.sheetord"
		:visitor="true"
	/>-->
	<SheetFrame
		v-if="project"
		:background-image-url="sheet.image"
	>
		<b-modal
			v-if="!sheet.features"
			content-class="shadow-sm"
			hide-backdrop
			hide-header
			no-close-on-backdrop
			no-close-on-esc
			no-fade
			scrollable
			static
			visible
		>
			<h1 class="h3">{{ sheet.title }}</h1>
			<p
				class="mb-4"
				v-html="(sheet.description || '').replace(/\n/g, '<br>')"
			/>
			<div v-if="sheet.survey">
				<Survey
					v-if="JSON.parse(sheet.survey).demographic"
					v-model="visitorAnswers"
					:survey="demographicSurvey"
				/>
				<Survey
					v-else
					v-model="visitorAnswers"
					:survey="sheet.survey"
				/>
			</div>
			<div
				v-if="interactions.includes('SocialSharing')"
				class="d-flex justify-content-around"
			>
				<ShareNetwork
					v-for="s in social"
					:key="s.network"
					:network="s.network"
					:url="projectUrl"
					title=""
				>
					<i
						class="fa-fw fa-2x"
						:class="s.icon"
					/>
				</ShareNetwork>
			</div>
			<template #modal-footer>
				<b-navbar>TODO: prev, next</b-navbar>
			</template>
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
							<p>Kérlek írd be a jelszót a megtekintéshez:</p>
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
export default {
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
			const interactions = sheet ? JSON.parse(sheet.interactions) : []; // for some reason I had to parse it here
			return { project, sheet, interactions };
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
			project: null,
			password: null,
			social: [
				{ network: 'facebook', icon: 'fab fa-facebook-f'.split(' ') },
				{ network: 'twitter', icon: 'fab fa-twitter'.split(' ') },
				{ network: 'email', icon: 'fas fa-envelope'.split(' ') },
			],
		};
	},
	computed: {
		projectUrl() {
			return window.location.href.replace(/\/\d+\/?/, '');
		},
	},
	mounted() {
		if (!this.project) {
			this.$refs.password.focus();
		}
		this.registerHit();
		this.loading = false;
	},
	methods: {
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
	},
};
</script>
