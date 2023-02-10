<template>
	<div class="container d-flex flex-column flex-grow-1">
		<div class="row flex-grow-1">
			<div class="col col-sm-10 col-md-8 col-lg-6 m-auto">
				<form
					ref="form"
					@submit.prevent="submit"
				>
					<div class="card shadow-sm">
						<CardHeader :text="$t('login.title')" />
						<div class="card-body">
							<b-alert
								v-if="successMessage"
								show
								variant="success"
							>
								{{ successMessage }}
							</b-alert>
							<b-alert
								v-if="errorMessage"
								show
								variant="danger"
							>
								{{ errorMessage }}
							</b-alert>
							<b-form-group>
								<b-input-group>
									<template #prepend>
										<b-input-group-text>
											<i class="fas fa-at fa-fw" />
										</b-input-group-text>
									</template>
									<b-form-input
										ref="email"
										v-model="login.email"
										:placeholder="$t('login.email')"
										required
										type="email"
									/>
								</b-input-group>
							</b-form-group>
							<b-form-group>
								<b-input-group>
									<template #prepend>
										<b-input-group-text>
											<i class="fas fa-key fa-fw" />
										</b-input-group-text>
									</template>
									<b-form-input
										v-model="login.password"
										:placeholder="$t('login.password')"
										type="password"
									/>
								</b-input-group>
							</b-form-group>
							<div class="text-right">
								<a
									href="javascript:void(0)"
									@click="forgot"
								>{{ $t('login.forgotPassword') }}</a>
							</div>
						</div>
						<div class="card-footer d-flex justify-content-between">
							<b-button
								:to="localePath('/register')"
								variant="link"
							>
								{{ $t('login.register') }}
							</b-button>
							<b-button
								type="submit"
								variant="primary"
							>
								{{ $t('login.submit') }}
							</b-button>
						</div>
						<LoadingOverlay :show="loading" />
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	middleware: ['publicOnly'],
	data() {
		let successMessage = '';
		let errorMessage = '';
		const params = Object.keys(this.$route.query);
		// TODO move param keys to constants from here and from reg/pwch too!
		if (params.includes('registered')) {
			successMessage = this.$t('login.registered');
		}
		if (params.includes('pwchanged')) {
			successMessage = this.$t('login.pwchanged');
		}
		if (params.includes('pwchangefailed')) {
			errorMessage = this.$t('login.pwchangefailed');
		}

		return {
			forgotMode: false,
			login: {
				email: '',
				password: '',
			},
			loading: true,
			successMessage,
			errorMessage,
		};
	},
	head() {
		return {
			title: this.$t('login.title'),
		};
	},
	async mounted() {
		const token = this.$route.query.t;
		if (token) {
			try {
				await this.$axios.$post('/api/user/activate', { token });
				this.successMessage = this.$t('login.activated');
			} catch {
				this.errorMessage = this.$t('login.activationFailed');
			}
		}
		await this.$recaptcha.init();
		this.loading = false;
		this.$refs.email.focus();
	},
	beforeDestroy() {
		this.$recaptcha.destroy();
	},
	methods: {
		forgot() {
			this.forgotMode = true;
			this.$refs.form.reportValidity() && this.submit();
			// for this to work properly, do NOT mark
			// password field as required in the template
		},
		async submit() {
			this.loading = true;
			this.errorMessage = '';
			this.successMessage = '';
			const captcha = await this.$recaptcha.execute(this.forgotMode ? 'forgot' : 'login');
			if (this.forgotMode) {
				try {
					await this.$axios.$post('/api/user/forgot', {
						email: this.login.email,
						captcha,
						locale: this.$i18n.locale,
					});
					this.successMessage = this.$t('login.passwordChangeRequested');
				} catch {
					this.errorMessage = this.$t('login.invalidEmail');
				}
			} else {
				try {
					await this.$auth.loginWith('cookie', {
						data: { ...this.login, captcha },
					});
				} catch (err) {
					this.errorMessage = this.$t('login.invalidEmailOrPassword');
				}
			}
			this.forgotMode = false;
			this.loading = false;
		},
	},
};
</script>
