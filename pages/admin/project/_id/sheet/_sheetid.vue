<template>
	<div>
		<EditorNavbar
			:title="`${project.title} - ${sheet.ord + 1} / ${project.sheets.length}`"
			:dynamic-title="false"
			@back="goBackToProject()"
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
		<div class="sheet-sidebar">
			<b-sidebar id="sheet-sidebar" visible left no-header @change="showBottomNav = !showBottomNav">
				<SheetEditor
					:sheet="sheet"
					:next-btn-enabled="nextSheetExists()"
					:prev-btn-enabled="prevSheetExists()"
					@sheetChanged="update"
					@prevSheet="goPrevSheet()"
					@nextSheet="goNextSheet()"
				/>
			</b-sidebar>
			<div class="sidebar-button sidebar-expand">
				<a v-b-toggle.sheet-sidebar href="#">
					<svg width="14" height="150">
						<path
							d=" M 0 150 L 13 135 L 13 15 L 0 0"
							fill="rgb(247,247,247)"
							stroke="rgb(223,223,223)"
						/>
						<path
							d="M 0 0 L 0 150"
						/>
					</svg>
				</a>
				<span class="material-icons collapse-icon">
					expand_less
				</span>
			</div>
		</div>
		<b-navbar
			v-if="showBottomNav"
			type="light"
			variant="white"
			class="bottom-nav justify-content-between fixed-bottom border-top shadow-sm"
		>
			<b-navbar-nav>
				<div v-if="prevSheetExists()">
					<b-button
						size="sm"
						@click="goPrevSheet()"
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
				</div>
			</b-navbar-nav>
			<b-navbar-nav>
				<div v-if="nextSheetExists()">
					<b-button
						size="sm"
						@click="goNextSheet()"
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
	data() {
		return {
			showBottomNav: false
		};
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
			this.$router.push('/admin/project/' + this.project.id);
		},
		getByOrd(ord) { // TODO server-side?
			const sheet = this.project.sheets.filter(sheet => { return sheet.ord === ord; });
			return sheet[0];
		},
		goPrevSheet() {
			this.$router.push('/admin/project/' + this.project.id + '/sheet/' + this.getByOrd(this.sheet.ord - 1).id);
		},
		goNextSheet() {
			this.$router.push('/admin/project/' + this.project.id + '/sheet/' + this.getByOrd(this.sheet.ord + 1).id);
		},
		prevSheetExists() {
			return !!this.getByOrd(this.sheet.ord - 1);
		},
		nextSheetExists() {
			return !!this.getByOrd(this.sheet.ord + 1);
		},
		test() {
			console.log('shown');
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
#sheet-sidebar {
	width: auto;
	height: auto;
	top: 120px;
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
.feature-sidebar .sidebar-button.sidebar-expand {
	right: 0;
	transform: translate(0, -50%) translateY(35px);
}
.sheet-sidebar .sidebar-button.sidebar-expand {
	left: 0;
	top: 0;
	transform: translate(0, -50%) translateY(320px);
}
.sidebar-button.sidebar-collapse {
	transform: translate(0, -50%);

}
.feature-sidebar .sidebar-button.sidebar-collapse {
	left: 0;
}
.sheet-sidebar .sidebar-button.sidebar-collapse {
	right: 0;
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
.bottom-nav .material-icons {
	font-size: 21px;
}
</style>
