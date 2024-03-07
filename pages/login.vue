<script setup lang="ts">
definePageMeta({
	middleware: ['public-only'],
});

const localePath = useLocalePath();
const { t } = useI18n();

useHead({
	title: t('login.title'),
});

const { executeReCaptcha } = useReCaptcha();

const forgotMode = ref(false);
const emailInput = ref();
const email = ref('');
const password = ref('');
const loading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');

async function submit() {
	try {
		const token = await executeReCaptcha('login');
		await authLogin(email.value, password.value, token || '');
	} catch {
		errorMessage.value = t('login.invalidEmailOrPassword');
	}
}

// OLD STUFF

/*const params = Object.keys(this.$route.query);
// TODO move param keys to constants from here and from reg/pwch too!
if (params.includes('registered')) {
	successMessage = this.$t('login.registered');
}
if (params.includes('pwchanged')) {
	successMessage = this.$t('login.pwchanged');
}
if (params.includes('pwchangefailed')) {
	errorMessage = this.$t('login.pwchangefailed');
}*/

//const forgotMode = false;

onMounted(() => {
	// TODO handle activation token
	/*const token = this.$route.query.t;
	if (token) {
		try {
			await this.$axios.$post('/api/user/activate', { token });
			this.successMessage = this.$t('login.activated');
		} catch {
			this.errorMessage = this.$t('login.activationFailed');
		}
	}*/

	// TODO init captcha
	// await this.$recaptcha.init();

	loading.value = false;
	emailInput.value.focus();
});

onBeforeUnmount(() => {
	// this.$recaptcha.destroy();
});

function forgot() {
	/*this.forgotMode = true;
	this.$refs.form.reportValidity() && this.submit();*/
	// for this to work properly, do NOT mark
	// password field as required in the template
}
/*async function submit() {
	this.loading = true;
	this.errorMessage = '';
	this.successMessage = '';
	const catpcha = 'TODO'; // TODO
	// const captcha = await this.$recaptcha.execute(this.forgotMode ? 'forgot' : 'login');
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
}*/
</script>

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
							<div
								v-if="successMessage"
								class="alert alert-success"
							>
								{{ successMessage }}
							</div>
							<div
								v-if="errorMessage"
								class="alert alert-danger"
							>
								{{ errorMessage }}
							</div>
							<div class="form-group">
								<div class="input-group">
									<div class="input-group-text">
										<i class="fas fa-at fa-fw" />
									</div>
									<input
										ref="emailInput"
										v-model="email"
										class="form-control"
										:placeholder="$t('login.email')"
										required
										type="email"
									/>
								</div>
							</div>
							<div class="form-group">
								<div class="input-group">
									<div class="input-group-text">
										<i class="fas fa-key fa-fw" />
									</div>
									<input
										v-model="password"
										class="form-control"
										:placeholder="$t('login.password')"
										type="password"
									/>
								</div>
							</div>
							<div class="text-end">
								<a
									href="javascript:void(0)"
									@click="forgot"
									>{{ $t('login.forgotPassword') }}</a
								>
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
