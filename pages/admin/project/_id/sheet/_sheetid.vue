<template>
	<div>
		<EditorNavbar
			:title="`${project.title} - ${sheet.ord + 1} / ${project.sheets.length}`"
			:dynamic-title="false"
			@back="goBackToProject"
		>
			<template #back-button-name> {{ project.title }}</template>
		</EditorNavbar>
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
		<b-navbar
			type="light"
			variant="white"
			class="justify-content-between fixed-bottom border-top shadow-sm"
		>
			<b-navbar-nav>
				<div v-if="getByOrd(sheet.ord - 1)">
					<NuxtLink
						:to="'/admin/project/' + project.id + '/sheet/' + getByOrd(sheet.ord - 1).id"
					>
						<b-button
							size="sm"
						>
							<div class="content d-flex">
								<div class="material-icons d-inline border-info  pr-1">
									arrow_back_ios
								</div>
								<div class="text d-inline">
									{{ getByOrd(sheet.ord - 1).title }}
								</div>
							</div>
						</b-button>
					</NuxtLink>
				</div>
			</b-navbar-nav>
			<b-navbar-nav>
				<div v-if="getByOrd(sheet.ord + 1)">
					<NuxtLink
						:to="'/admin/project/' + project.id + '/sheet/' + getByOrd(sheet.ord + 1).id"
					>
						<b-button
							size="sm"
						>
							<div class="content d-flex">
								<div class="text d-inline">
									{{ getByOrd(sheet.ord + 1).title }}
								</div>
								<div class="material-icons d-inline border-info pl-1">
									arrow_forward_ios
								</div>
							</div>
						</b-button>
					</NuxtLink>
				</div>
			</b-navbar-nav>
		</b-navbar>
	</div>
</template>

<script>
export default {
	async asyncData({ $axios, params, redirect }) {
		try {
			const sheet = await $axios.$get('/api/sheet/' + params.sheetid); // ID helyett ord
			const project = await $axios.$get('/api/project/' + params.id);
			return { sheet, project };
		} catch (err) {
			redirect('/admin/project/' + params.id);
			// TODO error üzenet
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
		},
		goBackToProject() {
			this.$router.go(-1);
		},
		getByOrd(ord) { // TODO server-side?
			const sheet = this.project.sheets.filter(sheet => { return sheet.ord === ord; });
			return sheet[0];
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
.side-footer {
	height: 100px;
}
</style>
<style scoped>
.material-icons {
	font-size: 21px;
}
</style>
