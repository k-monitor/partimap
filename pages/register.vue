<script setup lang="ts">
definePageMeta({
	middleware: ['public-only'],
});

const localePath = useLocalePath();
const { locale, t } = useI18n();

useHead({
	title: t('register.title'),
});

const email = ref('');
const emailInput = ref<HTMLInputElement>();
const password = ref('');
const fullName = ref('');
const address = ref('');
const birthPlace = ref('');
const birthDate = ref('');
const consentTerms = ref(false);
const consentPrivacy = ref(false);
const loading = ref(true);

onMounted(async () => {
	loading.value = false;
	emailInput.value?.focus();
});

const captcha = ref();
const { errorToast } = useToasts();

async function userReg() {
	if (!captcha.value) return;
	try {
		loading.value = true;
		await $fetch('/api/user/register', {
			method: 'POST',
			body: {
				captcha: captcha.value,
				locale: locale.value,
				consent: consentTerms.value && consentPrivacy.value,
				email: email.value,
				password: password.value,
				fullName: fullName.value,
				address: address.value,
			},
		});
		navigateTo(
			localePath({
				path: 'login',
				query: { registered: null },
			}),
		);
	} catch (err) {
		errorToast(t('register.registrationFailed'));
	} finally {
		loading.value = false;
	}
}
</script>

<template>
	<!-- eslint-disable vue/no-v-html -->
	<div class="container d-flex flex-column flex-grow-1">
		<div class="row flex-grow-1">
			<div class="col col-sm-10 col-md-8 col-lg-6 m-auto">
				<form @submit.prevent="userReg">
					<div class="card shadow-sm my-5">
						<CardHeader :text="t('register.title')" />
						<div class="card-body">
							<form-group :label="t('user.email')">
								<input
									ref="emailInput"
									v-model="email"
									class="form-control"
									required
									type="email"
								/>
							</form-group>
							<form-group :label="t('user.password')">
								<input
									v-model="password"
									class="form-control"
									required
									type="password"
								/>
							</form-group>
							<form-group :label="t('user.fullName')">
								<input
									v-model="fullName"
									class="form-control"
									required
								/>
							</form-group>
							<form-group :label="t('user.address')">
								<input
									v-model="address"
									class="form-control"
									required
								/>
							</form-group>
							<form-group :label="t('user.birthPlace')">
								<input
									v-model="birthPlace"
									class="form-control"
									required
								/>
							</form-group>
							<form-group :label="t('user.birthDate')">
								<BFormInput
									v-model="birthDate"
									class="form-control"
									required
									type="date"
								/>
							</form-group>

							<p class="my-4 small text-muted">{{ t('register.personalData') }}</p>

							<form-group>
								<div class="form-check">
									<input
										id="consentTerms"
										v-model="consentTerms"
										class="form-check-input"
										name="consentTerms"
										required
										type="checkbox"
									/>
									<label
										for="consentTerms"
										class="form-check-label"
									>
										{{ t('legal.consentTerms1') }}
										<a
											:href="localePath('/terms')"
											target="_blank"
											v-html="t('legal.consentTerms2')"
										/>
									</label>
								</div>
								<div class="form-check mt-2">
									<input
										id="consentPrivacy"
										v-model="consentPrivacy"
										class="form-check-input"
										name="consentPrivacy"
										required
										type="checkbox"
									/>
									<label
										for="consentPrivacy"
										class="form-check-label"
									>
										{{ t('legal.consentPrivacy1') }}
										<a
											:href="localePath('/privacy')"
											target="_blank"
											v-html="t('legal.consentPrivacy2')"
										/>
									</label>
								</div>
							</form-group>

							<p class="m-0 small text-muted">
								{{ t('register.procedure') }}
							</p>

							<NuxtTurnstile v-model="captcha" />
						</div>
						<div class="card-footer d-flex justify-content-between">
							<b-button
								:to="localePath('/login')"
								variant="link"
							>
								{{ t('register.login') }}
							</b-button>
							<b-button
								type="submit"
								variant="primary"
							>
								{{ t('register.submit') }}
							</b-button>
						</div>
						<LoadingOverlay :show="!captcha || loading" />
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
