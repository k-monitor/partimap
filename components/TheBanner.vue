<template>
	<header
		class="d-flex flex-column text-white"
		style="background-color: #007bff"
	>
		<div id="header-img"></div>
		<div class="container pb-3 text-center">
			<p class="fw-bold lead mb-0">
				{{ $t('landing.tagline1') }}
				<br class="d-none d-lg-inline" />
				{{ $t('landing.tagline2') }}
			</p>
		</div>
	</header>
</template>

<style scoped>
#header-img {
	background-image: url('/banner.png');
	background-position: center;
	background-repeat: repeat-x;
	--size: 320px;
	background-size: auto var(--size);
	height: var(--size);
}
</style>
