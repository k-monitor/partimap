<template>
	<div class="container d-flex flex-column flex-grow-1">
		<div class="row flex-grow-1">
			<div class="col col-sm-10 col-md-8 col-lg-6 m-auto">
				<form
					ref="form"
					@submit.prevent="submit"
				>
					<div class="card shadow-sm">
						<h5 class="card-header">Partimap Bejelentkezés</h5>
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
										placeholder="Email cím"
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
										placeholder="Jelszó"
										type="password"
									/>
								</b-input-group>
							</b-form-group>
							<div class="text-right">
								<a
									href="javascript:void(0)"
									@click="forgot"
								>Elfelejtettem a jelszavam</a>
							</div>
						</div>
						<div class="card-footer d-flex justify-content-between">
							<b-button
								:to="localePath('/register')"
								variant="link"
							>
								Még nincs fiókom
							</b-button>
							<b-button
								type="submit"
								variant="primary"
							>
								Bejelentkezés
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
			successMessage = 'Aktivációhoz szükséges email kiküldve!';
		}
		if (params.includes('pwchanged')) {
			successMessage = 'Jelszó sikeresen cserélve!';
		}
		if (params.includes('pwchangefailed')) {
			errorMessage = 'Jelszócsere sikertelen, próbáld újra!';
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
	head: {
		title: 'Bejelentkezés',
	},
	async mounted() {
		const token = this.$route.query.t;
		if (token) {
			try {
				await this.$axios.$post('/api/user/activate', { token });
				this.successMessage = 'Sikeres aktiválás, most már bejelentkezhetsz!';
			} catch {
				this.errorMessage = 'Sikertelen aktiválás, próbálj újra regisztrálni!';
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
					});
					this.successMessage = 'Jelszócseréhez szükséges email kiküldve';
				} catch {
					this.errorMessage = 'Érvénytelen email cím';
				}
			} else {
				try {
					await this.$auth.loginWith('cookie', {
						data: { ...this.login, captcha },
					});
				} catch (err) {
					this.errorMessage = 'Érvénytelen email vagy jelszó';
				}
			}
			this.forgotMode = false;
			this.loading = false;
		},
	},
};
</script>
