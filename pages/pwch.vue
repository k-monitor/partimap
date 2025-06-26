<script setup lang="ts">
definePageMeta({
	middleware: ['public-only'],
});

const localePath = useLocalePath();
const { t } = useI18n();

useHead({
	title: t('passwordChange.title'),
});

const captcha = ref();
const { currentRoute } = useRouter();

const password = ref('');
const passwordInput = ref<HTMLInputElement>();
const loading = ref(true);

onMounted(async () => {
	if (!currentRoute.value.query.t) {
		return navigateTo(localePath('login'));
	}

	loading.value = false;
	passwordInput.value?.focus();
});

async function submit() {
	if (!captcha.value) return;
	try {
		loading.value = true;
		const token = currentRoute.value.query.t;
		await $fetch('/api/user/pwch', {
			method: 'POST',
			body: {
				password: password.value,
				token,
				captcha: captcha.value,
			},
		});
		navigateTo(localePath({ path: 'login', query: { pwchanged: null } }));
	} catch (err) {
		navigateTo(localePath({ path: 'login', query: { pwchangefailed: null } }));
	} finally {
		loading.value = false;
	}
}
</script>

<template>
	<div class="container d-flex flex-column flex-grow-1">
		<div class="row flex-grow-1">
			<div class="col col-sm-10 col-md-8 col-lg-6 m-auto">
				<form @submit.prevent="submit">
					<div class="card shadow-sm">
						<CardHeader :text="$t('passwordChange.title')" />
						<div class="card-body">
							<form-group :label="$t('passwordChange.newPassword')">
								<input
									ref="passwordInput"
									v-model="password"
									class="form-control"
									required
									type="password"
								/>
							</form-group>
							<NuxtTurnstile v-model="captcha" />
						</div>
						<div class="card-footer d-flex justify-content-end">
							<button
								class="btn btn-primary"
								type="submit"
							>
								{{ $t('passwordChange.submit') }}
							</button>
						</div>
						<LoadingOverlay :show="!captcha || loading" />
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
