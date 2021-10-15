<template>
	<div class="container d-flex flex-column flex-grow-1">
		<div class="row flex-grow-1">
			<div class="col col-sm-10 col-md-8 col-lg-6 m-auto">
				<form @submit.prevent="userLogin">
					<div class="card shadow-sm">
						<h5 class="card-header">Partimap Bejelentkezés</h5>
						<div class="card-body">
							<b-input-group class="mb-3">
								<template #prepend>
									<b-input-group-text>
										<i class="fas fa-at fa-fw"/>
									</b-input-group-text>
								</template>
								<b-form-input
									ref="email"
									v-model="login.email"
									class="form-control"
									placeholder="Email cím"
									type="email"
								/>
							</b-input-group>
							<b-input-group>
								<template #prepend>
									<b-input-group-text>
										<i class="fas fa-key fa-fw" />
									</b-input-group-text>
								</template>
								<b-form-input
									v-model="login.password"
									class="form-control"
									placeholder="Jelszó"
									type="password"
								/>
							</b-input-group>
						</div>
						<div class="card-footer text-right">
							<button
								class="btn btn-primary"
								type="submit"
							>
								Bejelentkezés
								<i class="fas fa-sign-in-alt ml-1" />
							</button>
						</div>
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
		};
	},
	head: {
		title: 'Bejelentkezés',
	},
	mounted() {
		this.$refs.email.focus();
	},
	methods: {
		async userLogin() {
			try {
				await this.$auth.loginWith('cookie', {
					data: this.login,
				});
			} catch (err) {
				this.errorToast('Bejelentkezés sikertelen');
			}
		},
	},
};
</script>
