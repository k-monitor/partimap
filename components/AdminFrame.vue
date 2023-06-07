<template>
	<div>
		<b-navbar
			fixed="top"
			toggleable="lg"
			type="light"
			variant="white"
			class="border-bottom shadow-sm"
		>
			<b-navbar-brand :to="localePath('/admin')">
				<Logo />
			</b-navbar-brand>
			<b-navbar-toggle target="nav-collapse" />
			<b-collapse
				id="nav-collapse"
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
						v-if="$auth.user.isAdmin"
						:to="localePath('/admin/users')"
					>
						{{ $t('AdminFrame.users') }}
					</b-nav-item>
					<b-nav-item-dropdown :text="$t('AdminFrame.editHelp')">
						<b-dropdown-item
							:to="localePath('/admin/i18n/editors-help/')"
						>
							{{ $t('AdminFrame.editEditorsHelp') }}
						</b-dropdown-item>
						<b-dropdown-item
							:to="localePath('/admin/i18n/visitors-help/')"
						>
							{{ $t('AdminFrame.editVisitorsHelp') }}
						</b-dropdown-item>
					</b-nav-item-dropdown>
				</b-navbar-nav>
				<b-navbar-nav class="ml-auto">
					<b-nav-item :to="localePath('/admin/help')">
						{{ $t('AdminFrame.help') }}
					</b-nav-item>
					<b-nav-item-dropdown
						:text="$auth.user.name"
						right
					>
						<b-dropdown-item
							:to="localePath('/admin/user/' + $auth.user.id)"
						>
							{{ $t('AdminFrame.profile') }}
						</b-dropdown-item>
						<b-dropdown-item @click="$auth.logout('cookie')">
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
	</div>
</template>
