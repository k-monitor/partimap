<template>
	<div class="container d-flex flex-column flex-grow-1">
		<div class="row flex-grow-1">
			<div class="col col-sm-10 col-md-8 col-lg-6 m-auto">
				<form @submit.prevent="submit">
					<div class="card shadow-sm">
						<h5 class="card-header">{{$t('passwordChange.passwordChange')}}</h5>
						<div class="card-body">
							<b-form-group :label="$t('passwordChange.newPassword')">
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
								{{$t('passwordChange.save')}}
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
		return {
			password: '',
			loading: true,
		};
	},
	head() {
		return {
			title: this.$t('passwordChange.changePassOnHead'),
		};
	},
	async mounted() {
		if (!this.$route.query.t) {
			this.$router.push(this.localePath('login'));
		}
		await this.$recaptcha.init();
		this.loading = false;
		this.$refs.password.focus();
	},
	beforeDestroy() {
		this.$recaptcha.destroy();
	},
	methods: {
		async submit() {
			this.loading = true;
			try {
				const token = this.$route.query.t;
				const captcha = await this.$recaptcha.execute('pwch');
				await this.$axios.$post('/api/user/pwch', {
					password: this.password,
					token,
					captcha
				});
				this.$router.push(this.localePath({ path: 'login', query: { pwchanged: null } }));
			} catch (err) {
				this.$router.push(this.localePath({ path: 'login', query: { pwchangefailed: null } }));
			}
			this.loading = false;
		},
	},
};
</script>
