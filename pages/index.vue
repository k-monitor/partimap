<template>
	<div
		class="d-flex flex-column"
		style="min-height: 100vh"
	>
		<b-navbar
			class="border-bottom shadow-sm"
			fixed="top"
			toggleable="sm"
			type="light"
			variant="white"
		>
			<div class="container">
				<b-navbar-brand>
					<Logo />
				</b-navbar-brand>
				<b-navbar-toggle target="nav-collapse" />
				<b-collapse
					id="nav-collapse"
					is-nav
				>
					<b-navbar-nav class="ml-auto">
						<!-- soon -->
					</b-navbar-nav>
				</b-collapse>
			</div>
		</b-navbar>
		<section class="bg-primary pt-5 text-white">
			<div class="my-5 py-5 text-center">
				<h1 class="display-3 my-5">Partimap</h1>
			</div>
		</section>
		<section class="py-5">
			<div class="container">
				<p class="lead">Hamarosan...</p>
			</div>
		</section>
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
