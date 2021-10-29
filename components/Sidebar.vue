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
			<client-only>
				<b-overlay
					no-wrap
					opacity="0.5"
					:show="loading"
				/>
				<template #placeholder>
					<b-overlay
						no-wrap
						opacity="0.5"
						show
					/>
				</template>
			</client-only>
		</template>
		<template #footer>
			<FooterButtons
				class="bg-light border-top p-2 shadow-sm"
				:disable-save="!contentModified"
				:disable-submit="!contentModified"
				:show-next="showNext"
				:show-prev="showPrev"
				:show-save="admin"
				:show-submit="!admin && !showNext"
				@next="nav('next')"
				@prev="nav('prev')"
				@save="$emit('save')"
				@submit="$emit('submit')"
			/>
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
	/* does not work in scoped stlye block */
	font-size: 1rem;
}

.admin-sidebar .navbar-nav {
	min-width: 40px;
}
</style>
