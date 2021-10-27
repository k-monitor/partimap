<template>
	<b-sidebar
		v-model="visible"
		bg-variant="white"
		header-class="p-0 reset-font-size"
		shadow="sm"
		sidebar-class="border-right border-secondary"
	>
		<template #header="{ hide }">
			<b-navbar
				type="light"
				class="border-bottom shadow-sm w-100"
			>
				<b-navbar-brand
					role="button"
					@click="$emit('back')"
				>
					<strong>Partimap</strong>
					Admin
				</b-navbar-brand>
				<b-navbar-nav class="ml-auto">
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
	},
	computed: {
		...mapGetters(['getSidebarVisible']),
		visible: {
			get() {
				return this.getSidebarVisible;
			},
			set(v) {
				this.setSidebarVisible(v);
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
