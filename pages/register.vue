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
const name = ref('');
const password = ref('');
const consent = ref(false);
const loading = ref(true);
const termsModal = ref(false);

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
				consent: consent.value,
				email: email.value,
				locale: locale.value,
				name: name.value,
				password: password.value,
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
					<div class="card shadow-sm">
						<CardHeader :text="$t('register.title')" />
						<div class="card-body">
							<form-group :label="$t('register.email')">
								<input
									ref="emailInput"
									v-model="email"
									class="form-control"
									required
									type="email"
								/>
							</form-group>
							<form-group :label="$t('register.name')">
								<input
									v-model="name"
									class="form-control"
									required
								/>
							</form-group>
							<form-group :label="$t('register.password')">
								<input
									v-model="password"
									class="form-control"
									required
									type="password"
								/>
							</form-group>
							<form-group>
								<div class="form-check">
									<input
										id="consent"
										v-model="consent"
										class="form-check-input"
										name="consent"
										required
										type="checkbox"
									/>
									<label
										for="consent"
										class="form-check-label"
									>
										{{ $t('register.consent1') }}
										<a
											href="javascript:void(0)"
											@click.stop="termsModal = true"
											v-html="$t('register.consent2')"
										/>
									</label>
								</div>
							</form-group>

							<p class="m-0 small text-muted">
								{{ $t('register.procedure') }}
							</p>

							<NuxtTurnstile v-model="captcha" />
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
						<LoadingOverlay :show="!captcha || loading" />
					</div>
				</form>
			</div>
			<b-modal
				v-model="termsModal"
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
