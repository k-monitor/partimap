<template>
	<div class="logo overflow-hidden">
		<img
			src="/logo.svg"
			alt="Partimap"
			height="30"
		/>
		<img
			src="/logo-black.png"
			alt="Partimap"
			height="30"
			style="display: none"
		/>
	</div>
</template>

<style>
.logo.small {
	width: 31px;
}

@media screen and (max-width: 575.98px) {
	/* BS v4 xs */
	.logo {
		width: 31px;
	}
}
</style>
