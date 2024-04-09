<script setup lang="ts">
import type { Project } from '~/server/data/projects';

const localePath = useLocalePath();

const props = defineProps<{
	admin?: boolean;
	backLabel?: string;
	fixed?: boolean;
	loading?: boolean;
	project?: Project;
}>();

const { drawType, selectedFeatureId, sidebarVisible } = useStore();

onMounted(() => {
	if (props.fixed || !isMobile()) return;
	// on mobile we show how sidebar appears:
	sidebarVisible.value = false;
	setTimeout(() => {
		sidebarVisible.value = true;
	}, 500);
});

const visible = computed(() => props.fixed || sidebarVisible.value);
const visibleAndLoaded = computed(() => visible.value && !props.loading);

const sidebarButtonInsideIcons = ref<HTMLElement>();
watch(visibleAndLoaded, (vl) => {
	if (!isMobile() || !vl || !sidebarButtonInsideIcons.value) return;
	const cl = sidebarButtonInsideIcons.value.classList;
	cl.remove('animate__animated', 'animate__flash');
	cl.add('animate__animated', 'animate__flash');
	sidebarButtonInsideIcons.value.style.animationDelay = '2s';
});

function hide() {
	sidebarVisible.value = false;
}

function show() {
	const delay = isMobile() ? 1000 : 0;
	setTimeout(() => (sidebarVisible.value = true), delay);
}

const sidebarButton = ref<HTMLButtonElement>();
function showSidebarAndCancelDrawing() {
	drawType.value = '';
	sidebarVisible.value = true;
	sidebarButton.value?.blur();
}

watch(drawType, (t) => {
	if (t) {
		hide();
	} else {
		show();
	}
});

watch(selectedFeatureId, (id) => {
	if (id) show();
});

defineEmits<{
	(e: 'back'): void;
}>();
</script>

<template>
	<button
		ref="sidebarButton"
		class="sidebar-button btn btn-dark border-secondary border-start-0 position-absolute ps-1 py-2 rounded-0 shadow-sm text-white"
		:class="visible ? 'sidebar-visible' : 'sidebar-hidden'"
		@click="showSidebarAndCancelDrawing"
	>
		<i class="far fa-window-maximize fa-rotate-270" />
		<i class="fas fa-angle-double-right" />
	</button>
	<div
		class="sidebar bg-white border-end border-secondary d-flex flex-column shadow-sm"
		:class="visible ? 'sidebar-visible' : 'sidebar-hidden'"
		style="z-index: 1"
	>
		<nav class="sidebar-header bg-white border-bottom d-flex shadow-sm">
			<div class="align-items-center d-flex flex-grow-1 ps-3 py-3">
				<div
					v-if="admin"
					v-b-tooltip.hover
					role="button"
					:title="backLabel || $t('Sidebar.back')"
					@click="$emit('back')"
				>
					<Logo />
				</div>
				<a
					v-else
					v-b-tooltip.hover.bottom
					:href="localePath({ name: 'hogyan-mukodik' })"
					target="_blank"
					:title="$t('PublicFrame.help')"
				>
					<Logo class="small" />
				</a>
				<div
					v-if="!admin && project && project.user"
					class="mx-auto ml-lg-auto mr-lg-4"
				>
					<a
						:href="project.user.website"
						target="_blank"
					>
						<img
							v-if="project.user.logo"
							:src="project.user.logo"
							:alt="project.user.website"
							height="30"
						/>
					</a>
				</div>
			</div>

			<button
				v-if="!fixed"
				v-b-tooltip.hover
				class="sidebar-button-inside btn btn-primary border-left rounded-0"
				:title="$t('Sidebar.hide')"
				@click="hide"
			>
				<span ref="sidebarButtonInsideIcons">
					<i class="fas fa-angle-double-left" />
					<i
						class="fas fa-map-marked-alt position-relative"
						style="font-size: 110%"
					/>
				</span>
			</button>
		</nav>
		<div
			class="sidebar-body flex-grow-1 overflow-y-auto p-3"
			style="scrollbar-gutter: stable"
		>
			<slot />
		</div>
		<LoadingOverlay :show="loading" />

		<div
			v-if="$slots.footer"
			class="sidebar-footer bg-light border-top"
		>
			<slot name="footer" />
		</div>
	</div>
</template>

<style lang="scss">
@import '../node_modules/bootstrap/scss/functions';
@import '../node_modules/bootstrap/scss/variables';
@import '../node_modules/bootstrap/scss/mixins';

.sidebar {
	max-width: 100%;
	transition: margin 0.2s ease;
	z-index: 1; // needed for shadow

	bottom: 0;
	position: absolute;
	top: 0;
	@include media-breakpoint-up(md) {
		position: relative;
	}

	width: 360px;
	@include media-breakpoint-up(lg) {
		width: 42%;
	}

	&.sidebar-hidden {
		margin-left: -360px;
		@include media-breakpoint-up(lg) {
			margin-left: -42%;
		}
	}
}

.sidebar-header,
.sidebar-footer {
	// above highlighted feature
	z-index: 200;
}

.sidebar-button {
	border-top-right-radius: 0.5rem !important;
	border-bottom-right-radius: 0.5rem !important;
	font-size: 1.25rem;
	top: 0.5rem;
	transition: left 0.3s ease;
	z-index: 1; // above map
}

.sidebar-button.sidebar-visible {
	left: -100%;
}

.sidebar-button.sidebar-hidden {
	left: 0;
	transition-delay: 0.3s;
}

.tooltip {
	z-index: 10000; // above FLE highlight
}
</style>
