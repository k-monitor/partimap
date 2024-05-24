<template>
	<b-nav-item-dropdown
		id="ssr-id-LangSwitcher-dropdown"
		:teleport-disabled="true"
		teleport-to="body"
		right
	>
		<!-- TODO ^ id attribute is only needed to tackle BootstrapVueNext's SSR issue -->
		<template #button-content>
			<i class="fas fa-globe me-1" />
		</template>
		<b-dropdown-item
			v-for="locale in $i18n.locales"
			:key="locale.code"
			href="#"
			@click.prevent.stop="$i18n.setLocale(locale.code)"
		>
			<i
				class="fas fa-check me-1"
				:class="{ invisible: locale.code !== $i18n.locale }"
			/>
			<span :class="{ 'fw-bold': locale.code === $i18n.locale }">
				{{ locale.name }}
			</span>
		</b-dropdown-item>
	</b-nav-item-dropdown>
</template>
