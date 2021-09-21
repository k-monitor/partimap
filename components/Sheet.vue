<template>
	<p v-if="$fetchState.pending">Betöltés...</p>
	<p v-else-if="$fetchState.error">Hiba a munkalap betöltése során.</p>
	<b-container
		v-else-if="sheet"
		ref="background"
		fluid
		class="flex-grow-1 p-0"
		:style="'background: center / cover no-repeat url('+sheet.image+');'"
	>
		<EditorNavbar
			:title="`${project.title} - ${sheet.ord + 1} / ${project.sheets.length}`"
			:dynamic-title="false"
			:content-modified="contentModified"
			@back="goBackToProject"
			@save="saveMap"
		>
			<template #back-button-name> {{ project.title }}</template>
		</EditorNavbar>
		<MapEditor
			v-if="sheet.features"
			:features-raw="initSheetData.features"
		/>
		<div class="sheet-sidebar">
			<b-sidebar
				id="sheet-sidebar"
				visible
				left
				no-header
				@change="showBottomNav = !showBottomNav"
			>
				<SheetEditor
					:sheet="sheet"
					:next-btn-enabled="nextSheetExists()"
					:prev-btn-enabled="prevSheetExists()"
					@sheetDescriptionChanged="changeSheetDescription"
					@sheetTitleChanged="changeSheetTitle"
					@prevSheet="goPrevSheet"
					@nextSheet="goNextSheet"
					@collapse="handleCollapse"
					@uploadImage="uploadImage"
					@backgroundImageDeleted="update"
				/>
			</b-sidebar>
			<div ref="sidebar-expand" class="sidebar-button sidebar-expand">
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
						@click="goPrevSheet"
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
						@click="goNextSheet"
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
	</b-container>
</template>

<script>
import GeoJSON from 'ol/format/GeoJSON';
import { mapGetters } from 'vuex';

export default {
	props: {
		projectId: {
			type: String,
			required: true
		},
		sheetId: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			showBottomNav: false,
			imageSource: null,
			contentModified: false,
			sheet: null,
			project: null,
			initSheetData: null
		};
	},
	async fetch() {
		this.project = await this.$axios.$get('/api/project/' + this.projectId);
		this.sheet = this.project.sheets.filter(sheet => sheet.id === parseInt(this.sheetId))[0];
		this.initSheetData = { ...this.sheet };
	},
	computed: {
		...mapGetters({ getAllFeature: 'features/getAllFeature' }),

	},
	created() {
		this.$nuxt.$on('contentModified', () => {
			this.contentModified = true;
		});
	},
	mounted() {

	},
	beforeDestroy() {
		this.$nuxt.$off('contentModified');
	},
	methods: {
		async update(localSheet) {
			try {
				const sheet = await this.$axios.$patch('/api/sheet', localSheet);
				this.sheet = sheet;
				this.success('Módosítás sikeres.');
			} catch (error) {
				this.error('Módosítás sikertelen.');
			}
		},
		async uploadImage(image) {
			const formData = new FormData();
			formData.append('image', image);
			try {
				this.sheet = await this.$axios.$put('/api/sheet/' + this.sheet.id + '/image', formData, {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				});
			} catch (error) {
				this.error('Kép feltöltése sikertelen.');
			}
		},
		changeSheetDescription(val) {
			this.sheet.description = val;
		},
		changeSheetTitle(val) {
			this.sheet.title = val;
		},
		goBackToProject() {
			const route = '/admin/project/' + this.project.id;
			if (this.contentModified) {
				this.showConfirmModal(route);
			} else {
				this.$router.push(route);
			}
		},
		getByOrd(ord) {
			const sheet = this.project.sheets.filter(sheet => { return sheet.ord === ord; });
			return sheet[0];
		},
		goPrevSheet() {
			const route = '/admin/project/' + this.project.id + '/sheet/' + this.getByOrd(this.sheet.ord - 1).id;
			if (this.contentModified) {
				this.showConfirmModal(route);
			} else {
				this.$router.push(route);
			}
		},
		goNextSheet() {
			const route = '/admin/project/' + this.project.id + '/sheet/' + this.getByOrd(this.sheet.ord + 1).id;
			if (this.contentModified) {
				this.showConfirmModal(route);
			} else {
				this.$router.push(route);
			}
		},
		prevSheetExists() {
			return !!this.getByOrd(this.sheet.ord - 1);
		},
		nextSheetExists() {
			return !!this.getByOrd(this.sheet.ord + 1);
		},
		handleCollapse(collapseBtn) {
			this.$root.$emit('bv::toggle::collapse', 'sheet-sidebar');
			// place the expand button the same position as the collapse button
			const topPos = collapseBtn.getBoundingClientRect().top;
			this.$refs['sidebar-expand'].style.transform = `translateY(${topPos}px)`;
			this.$refs['sidebar-expand'].style.visibility = 'visible';
		},
		loadFeaturesFromStore() {
			const features = [];
			for (const f of this.getAllFeature) {
				const featureStr = new GeoJSON().writeFeature(f);
				features.push(JSON.parse(featureStr));
			}
			this.sheet.features = features.length ? features : [];
		},
		saveMap() {
			if (this.sheet.features) {
				this.loadFeaturesFromStore();
			}
			this.update(this.sheet);
			this.contentModified = false;
		},
		/**
		 * @param {string} route - redirect route upon modal close
		 */
		showConfirmModal(route) {
			this.$bvModal.msgBoxConfirm('Önnek nem mentett módosításai vannak. Kívánja őket menteni?', {
				title: 'Visszalépés',
				size: 'sm',
				buttonSize: 'sm',
				okVariant: 'danger',
				okTitle: 'IGEN',
				cancelTitle: 'NEM',
				footerClass: 'p-2',
				hideHeaderClose: false,
				centered: true,
				autoFocusButton: 'ok'
			})
				.then(value => {
					if (value === true) {
						this.saveMap();
						this.$router.push(route);
					} else if (value === false) {
						this.$router.push(route);
					} // Do nothing on window close or backdrop click
				})
				.catch(() => {
					this.error('Sikertelen mentés');
				});
		},
	}
};
</script>

<style>

#sheet-sidebar {
	border-radius: calc(0.25rem - 1px);
	height: auto;
	width: auto;
	top: 120px;
}

</style>
<style scoped>
.bottom-nav .material-icons {
	font-size: 21px;
}
</style>
