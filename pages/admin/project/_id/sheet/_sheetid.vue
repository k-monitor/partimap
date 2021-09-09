<template>
	<div>
		<MapNavbar
			:map-title="null"
			:map-modified="mapModified"
			@updateTitle="changeMapTitle"
			@back="goToMaps"
			@save="saveFeatures"
		/>
		<div class="feature-sidebar">
			<b-sidebar id="map-sidebar" visible right no-header>
				<FeatureListContainer
					:map-title="null"
				/>
			</b-sidebar>
			<div class="sidebar-button sidebar-expand">
				<a v-b-toggle.map-sidebar href="#">
					<svg width="13" height="150">
						<path
							d=" M 13 150 L 0 135 L 0 15 L 13 0"
							fill="rgb(247,247,247)"
							stroke="rgb(223,223,223)"
						/>
						<path
							d="M 13 0 L 13 150"
						/>
					</svg>
				</a>
				<span class="material-icons collapse-icon">
					expand_more
				</span>
			</div>
		</div>
		<SheetEditor
			:sheet="sheet"
			@sheetChanged="update"
		/>
	</div>
</template>

<script>
export default {
	async asyncData({ $axios, params, redirect }) {
		try {
			const sheet = await $axios.$get('/api/sheet/' + params.sheetid); // ID helyett ord
			return { sheet };
		} catch (err) {
			console.log(err.message);
		}
	},
	methods: {
		async update(localSheet) {
			try {
				await this.$axios.$patch('/api/sheet', localSheet);
				this.sheet = localSheet;
				this.success('Módosítás sikeres.');
			} catch (error) {
				this.error('Módosítás sikertelen.');
			}
		}
	}
};
</script>

<style>

#map-sidebar {
	top: 120px;
	bottom: 50px;
	height: auto;
	width: 270px;
}

@media screen and (max-width: 600px) {
	#map-sidebar {
		width: 220px;
	}
}

.sidebar-button {
	position: absolute;
	top: 50%;
}
.sidebar-button.sidebar-expand {
	right: 0;
	transform: translate(0, -50%) translateY(35px);
}
.sidebar-button.sidebar-collapse {
	left: 0;
	transform: translate(0, -50%);
}
.sidebar-button:hover path{
	fill: rgb(223, 223, 223);
}
.sidebar-button .collapse-icon {
	position: absolute;
	font-size: 15px;
	font-weight: 700;
	top: 50%;
	transform: translate(-15px, -50%) rotate(90deg);
	pointer-events: none;

}
</style>
