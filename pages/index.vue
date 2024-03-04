<script setup lang="ts">
const { defaultLocale, locale, messages, t } = useI18n();

useHead({
	title: t('landing.title'),
});

const features = computed(() => {
	try {
		const m = messages.value[locale.value]?.landing || ({} as any);
		return m.features || [];
	} catch {
		const m = messages.value[defaultLocale]?.landing || ({} as any);
		return m.features || [];
	}
});

const modals = ref(Array(features.value.length).fill(false));

const featureIndex = ref(-1);

watch(featureIndex, (i, p) => {
	if (p >= 0) {
		modals.value[p] = false;
	}
	if (i >= 0) {
		modals.value[i] = true;
	}
});

function showFeature(i: number) {
	featureIndex.value = -1;
	nextTick(() => (featureIndex.value = i));
}
</script>

<template>
	<!-- eslint-disable vue/no-v-html -->
	<PublicFrame>
		<header class="bg-primary py-5 text-white">
			<div class="container py-lg-3 text-center">
				<img
					alt="PARTIMAP"
					class="mb-5"
					src="/logo-white.png"
					style="width: 200px"
				/>
				<p class="fw-bold lead mb-0">
					{{ $t('landing.tagline1') }}
					<br class="d-none d-lg-inline" />
					{{ $t('landing.tagline2') }}
				</p>
			</div>
		</header>

		<section class="bg-white py-5">
			<div class="container">
				<div class="row">
					<div class="col-md-5 mx-auto">
						<p>{{ $t('landing.column1') }}</p>
					</div>
					<div class="col-md-5 mx-auto">
						<p>{{ $t('landing.column2') }}</p>
					</div>
				</div>
			</div>
		</section>

		<section class="bg-white">
			<div class="container-fluid py-lg-3 text-center">
				<b-button
					class="text-uppercase"
					:href="$t('landing.tryLink')"
					style="padding: 1rem 2.5rem"
					target="_blank"
					variant="outline-primary"
				>
					<strong>{{ $t('landing.tryButton') }}</strong>
				</b-button>
			</div>
		</section>

		<section
			v-if="locale === 'hu'"
			class="bg-white py-5"
		>
			<div class="bg-primary container p-4 text-justify text-white">
				<h4 class="mb-4 w-100">{{ $t('landing.methodTitle') }}</h4>
				<p class="mb-4">{{ $t('landing.methodDesc') }}</p>
				<div class="text-center">
					<b-button
						class="text-uppercase"
						:href="$t('landing.methodLink')"
						style="padding: 1rem 2.5rem"
						target="_blank"
						variant="outline-light"
					>
						<strong>{{ $t('landing.methodButton') }}</strong>
					</b-button>
				</div>
			</div>
		</section>

		<section class="bg-white py-5">
			<div class="container">
				<h2 class="mb-5 text-center">
					{{ $t('landing.featuresTitle') }}
				</h2>
				<div class="features row row-cols-1 row-cols-md-3">
					<div
						v-for="(f, i) in features"
						:key="f.title"
						class="col feature mb-3"
						role="button"
						@click="showFeature(i)"
					>
						<figure class="figure">
							<img
								:alt="f.title"
								class="figure-img img-fluid rounded shadow-sm"
								:src="`/landing/${i}.jpg`"
							/>
							<figcaption class="figure-caption">
								<h5 class="text-center">{{ f.title }}</h5>
							</figcaption>
						</figure>

						<b-modal
							v-model="modals[i]"
							centered
							scrollable
							:title="f.title"
						>
							<div v-html="f.description" />
							<template #footer>
								<div class="d-flex w-100">
									<b-button
										v-if="i > 0"
										variant="outline-primary"
										@click="featureIndex = i - 1"
									>
										<i class="fas fa-fw fa-angle-left" />
									</b-button>
									<b-button
										v-if="i < features.length - 1"
										class="ms-auto"
										variant="outline-primary"
										@click="featureIndex = i + 1"
									>
										<i class="fas fa-fw fa-angle-right" />
									</b-button>
								</div>
							</template>
						</b-modal>
					</div>
				</div>
			</div>
		</section>

		<section
			class="bg-light pb-3 pt-4"
			style="box-shadow: inset 0 20px 15px -15px rgba(0, 0, 0, 0.08)"
		>
			<div class="container">
				<div class="row">
					<div class="col-12 col-md-6 col-lg-5 d-flex">
						<figure class="figure d-flex align-items-center">
							<img
								src="/eu-commission-logo-en.svg"
								class="figure-img w-100"
								:alt="$t('landing.ec')"
							/>
						</figure>
						<figure class="figure d-flex align-items-center">
							<img
								src="/heinrich-boll-logo.svg"
								class="figure-img w-100"
								:alt="$t('landing.ec')"
							/>
						</figure>
					</div>
					<div class="col d-flex align-items-center">
						<p
							class="fw-bold mb-0"
							v-html="$t('landing.funding')"
						/>
					</div>
				</div>
			</div>
		</section>
	</PublicFrame>
</template>

<style scoped>
header {
	background-image: url('/header.png');
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
}

strong {
	font-weight: 700;
}

.features .feature {
	transition: all 150ms;
}
.features:hover .feature:not(:hover) {
	filter: grayscale(0.25);
	opacity: 0.85;
}
</style>
