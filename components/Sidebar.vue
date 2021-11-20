<template>
	<div>
		<b-button
			class="border border-secondary position-absolute py-2 shadow-sm sidebar-button"
			variant="light"
			@click="setSidebarVisible(true)"
		>
			<i class="fas fa-fw fa-angle-double-right" />
		</b-button>
		<b-sidebar
			v-model="visible"
			bg-variant="white"
			class="admin-sidebar"
			header-class="p-0"
			shadow="sm"
			sidebar-class="border-right border-secondary"
			width="360px"
		>
			<template #header="{ hide }">
				<b-navbar
					type="light"
					class="border-bottom justify-content-between shadow-sm w-100"
				>
					<b-navbar-brand
						v-if="admin"
						v-b-tooltip.hover
						role="button"
						:title="backLabel"
						@click="nav('back')"
					>
						<Logo />
					</b-navbar-brand>
					<b-navbar-brand
						v-else
						href="/"
						target="_blank"
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
							>
						</a>
					</div>
					<b-navbar-nav>
						<b-nav-item
							v-if="!fixed"
							v-b-tooltip.hover
							title="Oldalsáv elrejtése"
							@click="hide"
						>
							<i class="fas fa-fw fa-angle-double-left" />
						</b-nav-item>
					</b-navbar-nav>
				</b-navbar>
			</template>
			<template #default>
				<div class="p-3">
					<slot />
				</div>
				<LoadingOverlay :show="loading" />
			</template>
			<template #footer>
				<div class="bg-light border-top">
					<FooterButtons
						:disable-save="!contentModified"
						:disable-submit="!contentModified"
						:show-next="showNext"
						:show-prev="showPrev"
						:show-save="admin"
						:show-submit="!admin && step === steps"
						:step="step"
						:steps="steps"
						@next="nav('next')"
						@prev="nav('prev')"
						@save="$emit('save')"
						@submit="$emit('submit')"
					/>
				</div>
			</template>
		</b-sidebar>
	</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
	props: {
		admin: {
			type: Boolean,
			default: false,
		},
		backLabel: {
			type: String,
			default: 'Vissza',
		},
		contentModified: {
			type: Boolean,
			default: false,
		},
		fixed: {
			type: Boolean,
			default: false,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		project: { // needed for logo
			type: Object,
			default: null,
		},
		showNext: {
			type: Boolean,
			default: false,
		},
		showPrev: {
			type: Boolean,
			default: false,
		},
		step: {
			type: Number,
			default: 0,
		},
		steps: {
			type: Number,
			default: 0,
		},
	},
	computed: {
		...mapGetters(['getSidebarVisible']),
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
	},
	methods: {
		...mapMutations(['setSidebarVisible']),
		confirmIfNeeded() {
			if (this.contentModified) {
				return this.confirmLeavingUnsaved();
			}
			return true;
		},
		async nav(eventName) {
			if (this.admin) {
				const confirmed = await this.confirmIfNeeded();
				if (confirmed) {
					this.$emit(eventName);
				}
			} else {
				this.$emit(eventName);
			}
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
	top: 0.5rem;
}
</style>
