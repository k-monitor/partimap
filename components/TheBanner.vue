<template>
	<header
		class="py-4"
		style="
			background-color: #007bff;
			background-image: url('/banner-grid.png');
			background-position: center;
			background-size: auto 320px;
		"
	>
		<div style="display: grid; grid-template-columns: 1fr auto 1fr">
			<div style="position: relative">
				<img
					src="/banner-left.png"
					alt=""
					style="
						bottom: -36px;
						height: 250px;
						object-fit: cover;
						object-position: right bottom;
						position: absolute;
						width: 100%;
					"
				/>
			</div>
			<div class="container flex-grow-1 py-3 text-center text-white">
				<img
					src="/logo-white.png"
					alt=""
					style="height: 160px"
				/>
				<p
					class="fw-bold lead mx-auto my-0 p-3"
					style="max-width: 55ch"
				>
					{{ $t('landing.tagline1') }}
					{{ $t('landing.tagline2') }}
				</p>
			</div>
			<div style="position: relative">
				<img
					src="/banner-right.png"
					alt=""
					style="
						bottom: 16px;
						height: 250px;
						object-fit: cover;
						object-position: left bottom;
						position: absolute;
						width: 100%;
					"
				/>
			</div>
		</div>
		<div
			style="
				background-image: url('/banner-road.png');
				background-repeat: repeat-x;
				background-size: contain;
				height: 36px;
			"
		></div>
	</header>
</template>
