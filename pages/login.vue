<template>
	<div class="container d-flex flex-column flex-grow-1">
		<div class="row flex-grow-1">
			<div class="col col-sm-10 col-md-8 col-lg-6 m-auto">
				<form @submit.prevent="userLogin">
					<div class="card shadow-sm">
						<h5 class="card-header">Partimap Bejelentkezés</h5>
						<div class="card-body">
							<b-alert
								v-if="$route.params.successMessage"
								show
								variant="success"
							>
								{{ $route.params.successMessage }}
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
										required
										type="password"
									/>
								</b-input-group>
							</b-form-group>
						</div>
						<div class="card-footer d-flex justify-content-between">
							<b-button
								to="/register"
								variant="link"
							>
								Regisztráció
							</b-button>
							<b-button
								type="submit"
								variant="primary"
							>
								Bejelentkezés
								<i class="fas fa-sign-in-alt ml-1" />
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
	data() {
		return {
			login: {
				email: '',
				password: '',
			},
			loading: true,
		};
	},
	head: {
		title: 'Bejelentkezés',
	},
	mounted() {
		this.loading = false;
		this.$refs.email.focus();
	},
	methods: {
		async userLogin() {
			this.loading = true;
			try {
				await this.$auth.loginWith('cookie', {
					data: this.login,
				});
			} catch (err) {
				this.errorToast('Bejelentkezés sikertelen');
			}
			this.loading = false;
		},
	},
};
</script>
