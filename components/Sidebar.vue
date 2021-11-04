<template>
	<b-sidebar
		v-model="visible"
		bg-variant="white"
		class="admin-sidebar"
		header-class="p-0"
		__:no-header="!admin"
		shadow="sm"
		sidebar-class="border-right border-secondary"
		width="360px"
	>
		<template #header="{ hide }">
			<b-navbar
				v-if="admin"
				type="light"
				class="border-bottom justify-content-between shadow-sm w-100"
			>
				<b-navbar-nav>
					<b-nav-item
						v-b-tooltip.hover
						:title="backLabel"
						@click="nav('back')"
					>
						<i class="fas fa-fw fa-arrow-left" />
					</b-nav-item>
				</b-navbar-nav>
				<b-navbar-brand>
					<strong>Partimap</strong>
					<span>Admin</span>
				</b-navbar-brand>
				<b-navbar-nav>
					<b-nav-item
						v-if="!fixed"
						v-b-tooltip.hover
						class="ml-auto"
						title="Oldalsáv elrejtése"
						@click="hide"
					>
						<i class="fas fa-fw fa-times" />
					</b-nav-item>
				</b-navbar-nav>
			</b-navbar>
			<div
				v-else
				class="align-items-center bg-light border-bottom d-flex d-sm-none shadow-sm w-100"
			>
				<b-button
					class="btn ml-auto text-dark"
					variant="light"
					@click="hide"
				>
					Elrejtés
					<i class="fas fa-fw fa-times ml-1" />
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

.admin-sidebar .navbar-nav {
	min-width: 40px;
}
</style>
