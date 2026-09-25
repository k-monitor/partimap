<script setup>
defineProps({
	landing: { type: Boolean, default: false },
});

const { locale, locales, setLocale } = useI18n();
</script>

<template>
	<b-nav-item-dropdown right :class="{ 'lang-switcher-landing': landing }">
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

<style scoped>
/* Landing-only styles, enabled via the `landing` prop. */
.lang-switcher-landing .fa-globe {
	color: #0055ff;
}
.lang-switcher-landing :deep(.nav-link) {
	color: #0055ff;
}
.lang-switcher-landing :deep(.dropdown-menu) {
	min-width: 220px;
	background: rgba(255, 255, 255, 0.96);
	backdrop-filter: blur(8px);
	border: 1.5px solid #0055ff;
	border-radius: 12px;
	padding: 0.5rem 0;
	margin-top: 0.5rem;
	box-shadow: 0 8px 24px rgba(0, 85, 255, 0.12);
}
.lang-switcher-landing :deep(.dropdown-item) {
	padding: 0.55rem 1.1rem;
	color: #0055ff;
	font-size: 0.8rem;
	font-weight: 500;
	white-space: normal;
	line-height: 1.35;
}
.lang-switcher-landing :deep(.dropdown-item:hover),
.lang-switcher-landing :deep(.dropdown-item:focus),
.lang-switcher-landing :deep(.dropdown-item:active) {
	background: rgba(0, 85, 255, 0.08);
	color: #0055ff;
}
.lang-switcher-landing :deep(.nav-link::after) {
	transition: transform 0.2s ease;
}
.lang-switcher-landing :deep(.nav-link[aria-expanded='true']::after) {
	transform: rotate(180deg);
}
</style>
