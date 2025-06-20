<script setup>
const { locale, locales, setLocale } = useI18n();
</script>

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
			v-for="loc in locales"
			:key="loc.code"
			href="#"
			@click.prevent.stop="setLocale(loc.code)"
		>
			<i
				class="fas fa-check me-1"
				:class="{ invisible: loc.code !== locale }"
			/>
			<span :class="{ 'fw-bold': loc.code === locale }">
				{{ loc.name }}
			</span>
		</b-dropdown-item>
	</b-nav-item-dropdown>
</template>
