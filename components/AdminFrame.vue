<script setup lang="ts">
const { user } = useAuth();
const localePath = useLocalePath();

const visible = ref(false);
function toggle() {
	visible.value = !visible.value;
}
// ^ workaround because navbar toggler stops working after routing
// Bootstrap Vue Next v0.30.3
</script>

<template>
	<div>
		<b-navbar
			class="bg-white border-bottom shadow-sm"
			fixed="top"
			toggleable="lg"
		>
			<b-navbar-brand :to="localePath('/admin')">
				<Logo />
			</b-navbar-brand>
			<!-- <b-navbar-toggle target="nav-collapse" /> -->
			<button
				class="navbar-toggler"
				type="button"
				aria-label="Toggle navigation"
				@click="toggle"
			>
				<span class="navbar-toggler-icon"></span>
			</button>

			<b-collapse
				id="nav-collapse"
				v-model="visible"
				is-nav
			>
				<b-navbar-nav>
					<b-nav-item :to="localePath('/admin/projects')">
						{{ $t('AdminFrame.projects') }}
					</b-nav-item>
					<b-nav-item :to="localePath('/admin/maps')">
						{{ $t('AdminFrame.maps') }}
					</b-nav-item>
					<b-nav-item
						v-if="user?.isAdmin"
						:to="localePath('/admin/users')"
					>
						{{ $t('AdminFrame.users') }}
					</b-nav-item>
					<b-nav-item-dropdown
						v-if="user?.isAdmin"
						:text="$t('AdminFrame.editHelp')"
					>
						<b-dropdown-item :to="localePath('/admin/i18n/editors-help/')">
							{{ $t('AdminFrame.editEditorsHelp') }}
						</b-dropdown-item>
						<b-dropdown-item :to="localePath('/admin/i18n/visitors-help/')">
							{{ $t('AdminFrame.editVisitorsHelp') }}
						</b-dropdown-item>
					</b-nav-item-dropdown>
				</b-navbar-nav>
				<b-navbar-nav class="ms-auto">
					<b-nav-item :to="localePath('/admin/help')">
						{{ $t('AdminFrame.help') }}
					</b-nav-item>
					<b-nav-item-dropdown
						:text="user?.name"
						right
					>
						<b-dropdown-item :to="localePath('/admin/user/' + user?.id)">
							{{ $t('AdminFrame.profile') }}
						</b-dropdown-item>
						<b-dropdown-item @click="authLogout()">
							{{ $t('AdminFrame.logout') }}
						</b-dropdown-item>
					</b-nav-item-dropdown>
					<LangSwitcher />
				</b-navbar-nav>
			</b-collapse>
		</b-navbar>

		<div class="container mt-5 pt-5 flex-grow-1">
			<div class="card mb-5 shadow-sm">
				<h2
					v-if="$slots.header"
					class="card-header"
				>
					<slot name="header" />
				</h2>
				<div
					v-if="$slots.default"
					class="card-body d-flex flex-column"
				>
					<slot />
				</div>
				<div
					v-if="$slots.footer"
					class="card-footer"
				>
					<slot name="footer" />
				</div>
			</div>
		</div>
		<TermsModConsent />
	</div>
</template>
