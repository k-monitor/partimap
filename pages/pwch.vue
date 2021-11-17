<template>
	<div class="container d-flex flex-column flex-grow-1">
		<div class="row flex-grow-1">
			<div class="col col-sm-10 col-md-8 col-lg-6 m-auto">
				<form @submit.prevent="submit">
					<div class="card shadow-sm">
						<h5 class="card-header">Partimap Jelszócsere</h5>
						<div class="card-body">
							<b-form-group label="Új jelszó">
								<b-form-input
									ref="password"
									v-model="password"
									required
									type="password"
								/>
							</b-form-group>
						</div>
						<div class="card-footer d-flex justify-content-end">
							<b-button
								type="submit"
								variant="primary"
							>
								Mentés
							</b-button>
						</div>
						<LoadingOverlay :show="loading" />
					</div>
				</form>
			</div>
			<b-modal
				id="terms-modal"
				hide-footer
				scrollable
				title="Felhasználási feltételek és adatvédelmi nyilatkozat"
			>
				<h1>...</h1>
			</b-modal>
		</div>
	</div>
</template>

<script>
export default {
	middleware: ['publicOnly'],
	data() {
		return {
			password: '',
			loading: true,
		};
	},
	head: {
		title: 'Jelszócsere',
	},
	mounted() {
		if (!this.$route.query.t) {
			this.$router.push('login');
		}
		this.loading = false;
		this.$refs.password.focus();
	},
	methods: {
		async submit() {
			this.loading = true;
			try {
				const token = this.$route.query.t;
				await this.$axios.$post('/api/user/pwch', {
					password: this.password,
					token,
				});
				this.$router.push({
					name: 'login',
					params: {
						successMessage: 'Jelszó sikeresen cserélve!',
					},
				});
			} catch (err) {
				this.$router.push({
					name: 'login',
					params: {
						errorMessage: 'Jelszócsere sikertelen, próbáld újra!',
					},
				});
			}
			this.loading = false;
		},
	},
};
</script>
