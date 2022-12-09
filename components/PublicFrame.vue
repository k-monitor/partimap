<template>
	<div
		class="d-flex flex-column"
		style="min-height: 100vh; padding-top: 3.75rem;"
	>
		<b-navbar
			class="border-bottom shadow-sm"
			fixed="top"
			toggleable="sm"
			type="light"
			variant="white"
		>
			<div class="container">
				<b-navbar-brand :to="localePath('/')">
					<Logo />
				</b-navbar-brand>
				<b-navbar-toggle target="nav-collapse" />
				<b-collapse
					id="nav-collapse"
					is-nav
				>
					<b-navbar-nav class="ml-auto">
						<b-nav-item :to="localePath('/hogyan-mukodik')">{{ $t('PublicFrame.help') }}</b-nav-item>
						<b-nav-item :to="localePath('/admin')">{{ $t('PublicFrame.login') }}</b-nav-item>
						<LangSwitcher />
					</b-navbar-nav>
				</b-collapse>
			</div>
		</b-navbar>

		<slot />

		<footer class="bg-dark mt-auto py-3 text-white">
			<div class="container d-flex">
				<div>
					<a
						class="mr-3"
						href="https://k-monitor.hu/"
						target="_blank"
					>
						<img
							src="k-monitor-logo.png"
							alt="K-Monitor"
							height="31"
						>
					</a>
					<a
						class="mr-3"
						href="https://www.deepdata.hu/"
						target="_blank"
					>
						<img
							src="deepdata-logo.png"
							alt="DeepData"
							height="31"
						>
					</a>
				</div>
				<div class="ml-auto">
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
