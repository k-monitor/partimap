<template>
	<div class="container d-flex flex-column flex-grow-1">
		<div class="row flex-grow-1">
			<div class="col col-sm-10 col-md-8 col-lg-6 m-auto">
				<form @submit.prevent="userLogin">
					<div class="card shadow-sm">
						<h2 class="card-header">
							Partimap Bejelentkezés
						</h2>
						<div class="card-body">
							<div class="form-group">
								<label for="email">Email cím</label>
								<input
									id="email"
									v-model="login.email"
									class="form-control"
									type="email"
								>
							</div>
							<div class="form-group">
								<label for="password">Jelszó</label>
								<input
									id="password"
									v-model="login.password"
									class="form-control"
									type="password"
								>
							</div>
						</div>
						<div class="card-footer text-right">
							<button
								class="btn btn-primary"
								type="submit"
							>
								Bejelentkezés
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
		title: 'Bejelentkezés'
	},
	methods: {
		async userLogin() {
			try {
				await this.$auth.loginWith('cookie', {
					data: this.login,
				});
			} catch (err) {
				this.error('Bejelentkezés sikertelen');
			}
		},
	},
};
</script>
