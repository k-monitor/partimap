<script setup lang="ts">
const localePath = useLocalePath();

// FICXME type error @ b-navbar variant
</script>

<template>
	<div
		class="d-flex flex-column"
		style="min-height: 100vh; padding-top: 3.75rem"
	>
		<b-navbar
			class="border-bottom shadow-sm"
			:container="true"
			fixed="top"
			toggleable="sm"
			type="light"
			variant="white"
		>
			<b-navbar-brand :to="localePath('/')">
				<Logo />
			</b-navbar-brand>
			<b-navbar-toggle target="nav-collapse" />
			<b-collapse
				id="nav-collapse"
				is-nav
			>
				<b-navbar-nav class="ms-auto">
					<b-nav-item :to="localePath({ name: 'hogyan-mukodik' })">
						{{ $t('PublicFrame.help') }}
					</b-nav-item>
					<b-nav-item :to="localePath('/admin')">
						{{ $t('PublicFrame.login') }}
					</b-nav-item>
					<LangSwitcher />
				</b-navbar-nav>
			</b-collapse>
		</b-navbar>

		<slot />

		<footer class="bg-dark mt-auto py-3 text-white">
			<div class="container d-flex flex-wrap align-items-center">
				<div
					id="contactus"
					class="mb-4 mb-md-0 d-flex flex-grow-1 align-items-center justify-content-center"
				>
					{{ $t('PublicFrame.contactUs') }}
					<a
						class="fw-bold text-white ms-2"
						href="mailto:hello@partimap.eu"
						>hello@partimap.eu</a
					>
				</div>
				<div
					id="logos"
					class="d-flex align-items-center mx-auto"
				>
					<a
						class="me-3"
						:href="$t('PublicFrame.kmonitorUrl')"
						target="_blank"
					>
						<img
							src="/k-monitor-logo.png"
							alt="K-Monitor"
							height="31"
						/>
					</a>
					<a
						class="me-4"
						href="https://www.deepdata.hu/"
						target="_blank"
					>
						<img
							src="/deepdata-logo.png"
							alt="DeepData"
							height="31"
						/>
					</a>
					<a
						class="text-white"
						href="https://github.com/k-monitor/partimap"
						target="_blank"
					>
						<i class="fab fa-github fa-2x" />
					</a>
				</div>
			</div>
		</footer>
	</div>
</template>

<style lang="scss">
@import '../node_modules/bootstrap/scss/functions';
@import '../node_modules/bootstrap/scss/variables';
@import '../node_modules/bootstrap/scss/mixins';

#contactus {
	width: 100%;
}

@include media-breakpoint-up(md) {
	#contactus {
		justify-content: start !important;
		width: auto;
	}
}
</style>
