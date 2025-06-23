<script setup>
const { locale, locales, setLocale } = useI18n();
</script>

<template>
	<b-nav-item-dropdown right>
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
