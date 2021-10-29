<template>
	<b-sidebar
		v-model="visible"
		bg-variant="white"
		class="admin-sidebar"
		header-class="p-0"
		:no-header="!admin"
		shadow="sm"
		sidebar-class="border-right border-secondary"
		width="360px"
	>
		<template #header="{ hide }">
			<!-- admin header! -->
			<b-navbar
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
					Admin
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
		</template>
		<template #default>
			<div class="p-3">
				<slot />
			</div>
			<b-overlay
				no-wrap
				opacity="0.5"
				:show="loading"
			/>
		</template>
		<template #footer>
			<b-navbar
				class="border-top justify-content-between shadow-sm w-100"
				type="light"
				variant="light"
			>
				<b-navbar-nav>
					<b-button
						v-if="showPrev"
						variant="primary"
						@click="nav('prev')"
					>
						<i class="fas fa-fw fa-chevron-left" />
					</b-button>
				</b-navbar-nav>
				<b-navbar-nav>
					<b-button
						v-if="admin"
						class="mx-auto"
						:disabled="!contentModified"
						:variant="contentModified ? 'success' : 'outline-success'"
						@click="$emit('save')"
					>
						<i class="fas fa-fw fa-save mr-1" />
						<span>{{ contentModified ? 'Mentés' : 'Mentve' }}</span>
					</b-button>
				</b-navbar-nav>
				<b-navbar-nav>
					<b-button
						v-if="showNext"
						variant="primary"
						@click="nav('next')"
					>
						<i class="fas fa-fw fa-chevron-right" />
					</b-button>
				</b-navbar-nav>
			</b-navbar>
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
			const confirmed = await this.confirmIfNeeded();
			if (confirmed) {
				this.$emit(eventName);
			}
		},
	},
};
</script>

<style>
.admin-sidebar .b-sidebar-header {
	/* does not work in scoped stlye block */
	font-size: 1rem;
}

.admin-sidebar .navbar-nav {
	/* header & footer */
	min-width: 48px;
}
</style>
