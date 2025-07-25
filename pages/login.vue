<script setup lang="ts">
definePageMeta({
	middleware: ['public-only'],
});

const localePath = useLocalePath();
const { locale, t } = useI18n();

useHead({
	title: t('login.title'),
});

const captcha = ref();
const form = ref<HTMLFormElement>();
const emailInput = ref<HTMLInputElement>();
const email = ref('');
const password = ref('');
const loading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');

const { currentRoute } = useRouter();
const params = Object.keys(currentRoute.value.query);
// TODO move param keys to constants from here and from reg/pwch too!
['registered', 'pwchanged'].forEach((key) => {
	if (params.includes(key)) successMessage.value = t(`login.${key}`);
});
['pwchangefailed'].forEach((key) => {
	if (params.includes(key)) errorMessage.value = t(`login.${key}`);
});

onMounted(async () => {
	const { t: token } = currentRoute.value.query;
	if (token) {
		try {
			await $fetch('/api/user/activate', {
				method: 'POST',
				body: { token },
			});
			successMessage.value = t('login.activated');
		} catch {
			errorMessage.value = t('login.activationFailed');
		}
	}
	loading.value = false;
	emailInput.value?.focus();
});

async function login() {
	if (!captcha.value || !form.value?.reportValidity()) return;
	try {
		loading.value = true;
		errorMessage.value = '';
		successMessage.value = '';
		await authLogin(email.value, password.value, captcha.value);
	} catch {
		errorMessage.value = t('login.invalidEmailOrPassword');
	} finally {
		loading.value = false;
	}
}

async function forgot() {
	if (!captcha.value || !form.value?.reportValidity()) return;
	// password is NOT required
	try {
		loading.value = true;
		errorMessage.value = '';
		successMessage.value = '';
		await $fetch('/api/user/forgot', {
			method: 'POST',
			body: {
				captcha: captcha.value,
				email: email.value,
				locale: locale.value,
			},
		});
		successMessage.value = t('login.passwordChangeRequested');
	} catch {
		errorMessage.value = t('login.invalidEmail');
	} finally {
		loading.value = false;
	}
}
</script>

<template>
	<div class="container d-flex flex-column flex-grow-1">
		<div class="row flex-grow-1">
			<div class="col col-sm-10 col-md-8 col-lg-6 m-auto">
				<form
					ref="form"
					@submit.prevent="login"
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
							<NuxtTurnstile v-model="captcha" />
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
						<LoadingOverlay :show="!captcha || loading" />
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
