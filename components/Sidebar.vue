<template>
	<div>
		<b-button
			ref="sidebarButton"
			class="sidebar-button bg-dark border border-secondary position-absolute pl-1 py-2 shadow-sm text-white"
			:class="visible ? 'sidebar-visible' : 'sidebar-hidden'"
			variant="light"
			@click="showSidebarAndCancelDrawing"
		>
			<i class="far fa-window-maximize fa-rotate-270" />
			<i class="fas fa-angle-double-right" />
		</b-button>
		<b-sidebar
			v-model="visible"
			bg-variant="white"
			class="admin-sidebar"
			header-class="p-0"
			no-close-on-esc
			shadow="sm"
			sidebar-class="border-right border-secondary"
			width="360px"
		>
			<template #header>
				<div class="border-bottom d-flex flex-grow-1 shadow-sm">
					<b-navbar
						type="light"
						class="flex-grow-1 justify-content-between"
					>
						<b-navbar-brand
							v-if="admin"
							v-b-tooltip.hover
							role="button"
							:title="backLabel"
							@click="$emit('back')"
						>
							<Logo />
						</b-navbar-brand>
						<b-navbar-brand
							v-else
							v-b-tooltip.hover.bottom
							:href="localePath({ name: 'hogyan-mukodik' })"
							target="_blank"
							:title="$t('PublicFrame.help')"
						>
							<Logo class="small" />
						</b-navbar-brand>
						<div
							v-if="!admin && project && project.user"
							class="mx-auto"
						>
							<a
								:href="project.user.website"
								target="_blank"
							>
								<img
									v-if="project.user.logo"
									:src="project.user.logo"
									:alt="project.user.website"
									height="30"
								/>
							</a>
						</div>
					</b-navbar>
					<b-button
						v-if="!fixed"
						v-b-tooltip.hover
						class="sidebar-button-inside border-left rounded-0"
						:title="$t('Sidebar.hide')"
						variant="light"
						@click="hide"
					>
						<span ref="sidebarButtonInsideIcons">
							<i class="fas fa-angle-double-left" />
							<i
								class="fas fa-map-marked-alt position-relative"
								style="font-size: 110%"
							/>
						</span>
					</b-button>
				</div>
			</template>
			<template #default>
				<div class="p-3">
					<slot />
				</div>
				<LoadingOverlay :show="loading" />
			</template>
			<template #footer>
				<div class="bg-light border-top">
					<slot name="footer" />
				</div>
			</template>
		</b-sidebar>
	</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { isMobile } from '@/assets/constants';

export default {
	props: {
		admin: {
			type: Boolean,
			default: false,
		},
		backLabel: {
			type: String,
			default() {
				return this.$t('Sidebar.back');
			},
		},
		fixed: {
			type: Boolean,
			default: false,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		project: {
			// needed for logo and preview button
			type: Object,
			default: null,
		},
	},
	computed: {
		...mapGetters(['getDrawType', 'getSidebarVisible']),
		...mapGetters('selected', ['getSelectedFeature']),
		visible: {
			get() {
				return this.fixed ? true : this.getSidebarVisible;
			},
			set(v) {
				if (!this.fixed) {
					this.setSidebarVisible(v);
				}
			},
		},
		visibleAndLoaded() {
			return this.visible && !this.loading;
		},
	},
	watch: {
		getDrawType(t) {
			if (t) {
				this.hide();
			} else {
				this.show();
			}
		},
		getSelectedFeature(f) {
			if (f) {
				this.show();
			}
		},
		visibleAndLoaded(vl) {
			if (!vl) return;
			const cl = this.$refs.sidebarButtonInsideIcons.classList;
			cl.remove('animate__animated', 'animate__flash');
			cl.add('animate__animated', 'animate__flash');
			this.$refs.sidebarButtonInsideIcons.style.animationDelay = '2s';
		},
	},
	methods: {
		...mapMutations(['setDrawType', 'setSidebarVisible']),
		hide() {
			this.setSidebarVisible(false);
		},
		show() {
			const delay = isMobile() ? 1000 : 0;
			window.setTimeout(() => {
				this.setSidebarVisible(true);
			}, delay);
		},
		showSidebarAndCancelDrawing() {
			this.setDrawType('');
			this.setSidebarVisible(true);
			this.$refs.sidebarButton.blur();
		},
	},
};
</script>

<style>
.admin-sidebar .b-sidebar-header {
	/* does not work in scoped style block */
	font-size: 1rem;
}

.sidebar-button {
	border-top-right-radius: 0.5rem;
	border-bottom-right-radius: 0.5rem;
	border-top-left-radius: 0px !important;
	border-bottom-left-radius: 0px !important;
	border-left-width: 0px !important;
	font-size: 1.25rem;
	top: 0.5rem;
	transition: left 0.3s ease;
}

.sidebar-button.sidebar-visible {
	left: -100%;
}

.sidebar-button.sidebar-hidden {
	left: 0;
	transition-delay: 0.3s;
}
</style>
