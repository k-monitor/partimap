<template>
	<b-container
		id="background"
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
		<div v-if="sheet.features" class="feature-sidebar">
			<MapEditor
				:features-raw="initSheetData.features"
			/>
		</div>
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
					@deleteBackgroundImage="uploadImage(null)"
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
	async asyncData({ $axios, store, params, redirect }) {
		store.commit('features/clear');
		try {
			const sheet = await $axios.$get('/api/sheet/' + params.sheetid); // TODO ID helyett ord?
			const project = await $axios.$get('/api/project/' + params.id); // TODO sheet/projects
			return { sheet, initSheetData: { ...sheet }, project };
		} catch {
			redirect('/admin/project/' + params.id);
		}
	},
	data() {
		return {
			showBottomNav: false,
			imageSource: null,
			contentModified: false
		};
	},
	computed: {
		...mapGetters({ getAllFeature: 'features/getAllFeature' }),

	},
	created() {
		this.$nuxt.$on('contentModified', () => {
			this.contentModified = true;
		});
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
			if (this.contentModified) {
				this.showConfirmModal();
			} else {
				this.$router.push('/admin/project/' + this.project.id);
			}
		},
		getByOrd(ord) {
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
		showConfirmModal() {
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
						this.$router.push('/admin/project/' + this.project.id);
					} else if (value === false) {
						this.$router.push('/admin/project/' + this.project.id);
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
