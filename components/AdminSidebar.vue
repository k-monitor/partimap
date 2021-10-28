<template>
	<b-sidebar
		v-model="visible"
		bg-variant="white"
		header-class="p-0 reset-font-size"
		shadow="sm"
		sidebar-class="border-right border-secondary"
		width="360px"
	>
		<template #header="{ hide }">
			<b-navbar
				type="light"
				class="border-bottom shadow-sm w-100"
			>
				<b-navbar-nav
					v-b-tooltip.hover
					class="mr-auto"
					:title="`Vissza ide: ${backLabel}`"
				>
					<b-nav-item @click="$emit('back')">
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
				<b-navbar-nav
					v-if="!fixed"
					v-b-tooltip.hover
					class="ml-auto"
					title="Oldalsáv elrejtése"
				>
					<b-nav-item @click="hide">
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
			<div class="align-items-center bg-light border-top d-flex p-3">
				<b-button
					variant="outline-secondary"
					@click="$emit('back')"
				>
					<i class="fas fa-fw fa-chevron-left mr-1" />
					{{ backLabel }}
				</b-button>
				<b-button
					class="ml-auto"
					:disabled="!contentModified"
					variant="success"
					@click="$emit('save')"
				>
					<i class="fas fa-fw fa-save mr-1" />
				</b-button>
			</div>
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
.b-sidebar-header.reset-font-size {
	font-size: 1rem;
}
</style>
