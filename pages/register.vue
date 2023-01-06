<template>
	<div class="container d-flex flex-column flex-grow-1">
		<div class="row flex-grow-1">
			<div class="col col-sm-10 col-md-8 col-lg-6 m-auto">
				<form @submit.prevent="userReg">
					<div class="card shadow-sm">
						<CardHeader :text="$t('register.title')" />
						<div class="card-body">
							<b-form-group :label="$t('register.email')">
								<b-form-input
									ref="email"
									v-model="reg.email"
									required
									type="email"
								/>
							</b-form-group>
							<b-form-group :label="$t('register.name')">
								<b-form-input
									v-model="reg.name"
									required
								/>
							</b-form-group>
							<b-form-group :label="$t('register.password')">
								<b-form-input
									v-model="reg.password"
									required
									type="password"
								/>
							</b-form-group>
							<b-form-group>
								<b-form-checkbox
									v-model="reg.consent"
									name="consent"
									required
								>
									{{ $t('register.consent1') }}
									<a
										href="javascript:void(0)"
										@click.stop="$bvModal.show('terms-modal')"
									>{{ $t('register.consent2') }}</a>
								</b-form-checkbox>
							</b-form-group>
						</div>
						<div class="card-footer d-flex justify-content-between">
							<b-button
								:to="localePath('/login')"
								variant="link"
							>
								{{ $t('register.login') }}
							</b-button>
							<b-button
								type="submit"
								variant="primary"
							>
								{{ $t('register.submit') }}
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
				size="lg"
				:title="$t('register.termsTitle')"
			>
				<Terms />
			</b-modal>
		</div>
	</div>
</template>

<script>
export default {
	middleware: ['publicOnly'],
	data() {
		return {
			reg: {
				email: '',
				name: '',
				password: '',
			},
			loading: true,
		};
	},
	head() {
		return {
			title: this.$t('register.title'),
		};
	},
	async mounted() {
		await this.$recaptcha.init();
		this.loading = false;
		this.$refs.email.focus();
	},
	beforeDestroy() {
		this.$recaptcha.destroy();
	},
	methods: {
		async userReg() {
			this.loading = true;
			const captcha = await this.$recaptcha.execute('register');
			try {
				await this.$axios.$put('/api/user', { ...this.reg, captcha });
				this.$router.push(this.localePath({ path: 'login', query: { registered: null } }));
			} catch (err) {
				this.errorToast(this.$t('register.registrationFailed'));
			}
			this.loading = false;
		},
	},
};
</script>
