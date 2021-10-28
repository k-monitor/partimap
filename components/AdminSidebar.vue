<template>
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
				<b-navbar-nav>
					<b-nav-item
						v-b-tooltip.hover
						:title="`Vissza ide: ${backLabel}`"
						@click="$emit('back')"
					>
						<i class="fas fa-fw fa-arrow-left" />
					</b-nav-item>
				</b-navbar-nav>
				<b-navbar-brand
					v-b-tooltip.hover
					role="button"
					:title="`Vissza ide: ${backLabel}`"
					@click="$emit('back')"
				>
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
						@click="$emit('prev')"
					>
						<i class="fas fa-fw fa-chevron-left" />
					</b-button>
				</b-navbar-nav>
				<b-navbar-nav>
					<b-button
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
						@click="$emit('next')"
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
	},
};
</script>

<style>
.admin-sidebar .b-sidebar-header {
	/* does not work in scoped stlye block */
	font-size: 1rem;
}

.admin-sidebar .navbar-nav {
	min-width: 48px;
}
</style>
