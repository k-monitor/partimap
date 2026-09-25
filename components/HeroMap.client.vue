<script setup lang="ts">
import type { Feature as OlFeature, Map, View } from 'ol';
import type { Coordinate } from 'ol/coordinate';
import DoubleClickZoom from 'ol/interaction/DoubleClickZoom';
import KeyboardPan from 'ol/interaction/KeyboardPan';
import KeyboardZoom from 'ol/interaction/KeyboardZoom';
import MouseWheelZoom from 'ol/interaction/MouseWheelZoom';
import { transform } from 'ol/proj';
import { Circle, Fill, Stroke, Style } from 'ol/style';

const GOOGLEMAPS_PROJECTION = 'EPSG:4326';
const PARTIMAP_PROJECTION = 'EPSG:3857';

const { t } = useI18n();
const coords = t('Map.initialCenter').split(',');
const gm2ol = (c: number[]) => transform(c, GOOGLEMAPS_PROJECTION, PARTIMAP_PROJECTION);
const initialCenter = gm2ol(coords.reverse().map((p) => Number(p)));
const initialZoom = Number(t('Map.initialZoom')) || 10;

const mapRef = ref<{ map: Map }>();
const viewRef = ref<{ view: View }>();

onMounted(() => {
	const map = mapRef.value?.map;
	if (!map) return;
	map.getInteractions().forEach((interaction) => {
		if (
			interaction instanceof MouseWheelZoom ||
			interaction instanceof DoubleClickZoom ||
			interaction instanceof KeyboardPan ||
			interaction instanceof KeyboardZoom
		) {
			map.removeInteraction(interaction);
		}
	});
});

function zoomIn() {
	const view = viewRef.value?.view;
	if (!view) return;
	view.animate({ zoom: (view.getZoom() || 0) + 1, duration: 200 });
}

function zoomOut() {
	const view = viewRef.value?.view;
	if (!view) return;
	view.animate({ zoom: (view.getZoom() || 0) - 1, duration: 200 });
}

const locating = ref(false);

function locate() {
	const view = viewRef.value?.view;
	if (!view || locating.value || !navigator.geolocation) return;
	locating.value = true;
	navigator.geolocation.getCurrentPosition(
		({ coords }) => {
			locating.value = false;
			view.animate({
				center: gm2ol([coords.longitude, coords.latitude]),
				zoom: Math.max(view.getZoom() || 0, 15),
				duration: 600,
			});
		},
		() => {
			locating.value = false;
		},
		{ enableHighAccuracy: true, timeout: 10000 },
	);
}

const pinnedCoord = ref<Coordinate | null>(null);

function selectLocation() {
	const view = viewRef.value?.view;
	if (!view) return;
	pinnedCoord.value = view.getCenter() || null;
}

function pinStyle(_f: OlFeature) {
	return new Style({
		image: new Circle({
			radius: 8,
			fill: new Fill({ color: '#0055ff' }),
			stroke: new Stroke({ color: '#ffffff', width: 2.5 }),
		}),
	});
}
</script>

<template>
	<div class="hm-outer">
		<!-- 30° decorative line behind the circle -->
		<div class="hm-diag-line" aria-hidden="true" />

		<!-- Circular map window -->
		<div class="hm-circle">
			<ol-map
				ref="mapRef"
				:load-tiles-while-animating="true"
				:load-tiles-while-interacting="true"
				style="width: 100%; height: 100%"
			>
				<ol-view
					ref="viewRef"
					:center="initialCenter"
					:zoom="initialZoom"
					max-zoom="19"
					:projection="PARTIMAP_PROJECTION"
				/>
				<!-- Plain OSM tiles: free, no API key. The custom class-name gives this
				     layer its own canvas, so the filter that fades it to the pale
				     landing-page palette leaves the pin layer above it untouched. -->
				<ol-tile-layer class-name="ol-layer hm-basemap">
					<ol-source-osm />
				</ol-tile-layer>
				<ol-vector-layer v-if="pinnedCoord" :z-index="500">
					<ol-source-vector>
						<ol-feature>
							<ol-geom-point :coordinates="pinnedCoord" />
							<ol-style :override-style-function="pinStyle" />
						</ol-feature>
					</ol-source-vector>
				</ol-vector-layer>
			</ol-map>
			<div class="hm-center-pin" aria-hidden="true">
				<div class="hm-center-pin-head" />
				<!-- <div class="hm-center-pin-tail" /> -->
			</div>
			<!-- OSM requires visible credit on the map itself; the circular mask
			     clips anything outside it, so it sits inside the circle. -->
			<p class="hm-attrib">
				&copy;
				<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
					OpenStreetMap
				</a>
				contributors
			</p>
		</div>

		<!-- Zoom controls, outside the circle -->
		<button class="hm-btn hm-btn-in" :aria-label="t('landing.hero.btnZoomIn')" @click.stop="zoomIn">
			<span class="hm-btn-glyph"><i class="fas fa-plus" /></span>
			<span class="hm-btn-label">{{ t('landing.hero.btnZoomIn') }}</span>
		</button>
		<button class="hm-btn hm-btn-out" :aria-label="t('landing.hero.btnZoomOut')" @click.stop="zoomOut">
			<span class="hm-btn-glyph"><i class="fas fa-minus" /></span>
			<span class="hm-btn-label">{{ t('landing.hero.btnZoomOut') }}</span>
		</button>

		<!-- Jump to own position button, above the select location button -->
		<button class="hm-btn hm-btn-locate" :aria-label="t('landing.hero.btnLocate')" @click.stop="locate">
			<span class="hm-btn-glyph">
				<i :class="locating ? 'fas fa-spinner fa-spin' : 'fas fa-location-crosshairs'" />
			</span>
			<span class="hm-btn-label">{{ t('landing.hero.btnLocate') }}</span>
		</button>

		<!-- Select location button -->
		<button class="hm-btn hm-btn-select" :aria-label="t('landing.hero.btnPin')" @click.stop="selectLocation">
			<span class="hm-btn-glyph"><i class="fas fa-arrow-right" /></span>
			<span class="hm-btn-label">{{ t('landing.hero.btnPin') }}</span>
		</button>
	</div>
</template>

<style scoped>
/* Fills the full .hero-circle-wrap container */
.hm-outer {
	position: absolute;
	inset: 0;
	z-index: 1;
}

/* 80% circular window — same footprint as the old hero-blue-circle */
.hm-circle {
	position: absolute;
	width: 80%;
	height: 80%;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	border-radius: 50%;
	overflow: hidden;
}

/* OSM's own tiles are far more saturated than the landing-page palette, so the
   basemap canvas is desaturated and lightened towards the pale look of the
   surrounding section. Scoped to the basemap layer's own container, so the
   blue pin drawn in the vector layer keeps its full colour. */
.hm-circle :deep(.hm-basemap) {
	filter: saturate(0.22) brightness(1.08) contrast(0.92);
}

/* OSM attribution, pinned inside the circle. Kept on one line and away from
   the very bottom of the circle, where the mask leaves too little width. */
.hm-attrib {
	position: absolute;
	bottom: 7%;
	left: 50%;
	transform: translateX(-50%);
	z-index: 1200;
	margin: 0;
	padding: 2px 6px;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.78);
	color: #333;
	font-size: clamp(0.5rem, 1.4vw, 0.62rem);
	line-height: 1.3;
	white-space: nowrap;
}

.hm-attrib a {
	color: inherit;
	text-decoration: underline;
}

.hm-attrib a:hover {
	color: #0055ff;
}

/* Fixed center pin for selecting location while dragging map */
.hm-center-pin {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -100%);
	pointer-events: none;
	z-index: 1100;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.hm-center-pin-head {
	width: 18px;
	height: 18px;
	border-radius: 50% 50% 50% 0;
	transform: rotate(-45deg);
	background: #0055ff;
	box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.92);
	position: relative;
}

.hm-center-pin-head::after {
	content: '';
	position: absolute;
	left: 50%;
	top: 50%;
	width: 6px;
	height: 6px;
	border-radius: 50%;
	transform: translate(-50%, -50%) rotate(45deg);
	background: #fff;
}

.hm-center-pin-tail {
	width: 2px;
	height: 12px;
	margin-top: -2px;
	background: #0055ff;
	border-radius: 1px;
	opacity: 0.8;
}

/* Horizontal crosshair line */
.hm-axis-h {
	position: absolute;
	top: 50%;
	left: 0;
	right: 0;
	height: 1px;
	background: rgba(0, 85, 255, 0.45);
	pointer-events: none;
	z-index: 1000;
}

/* Vertical crosshair line */
.hm-axis-v {
	position: absolute;
	left: 50%;
	top: 0;
	bottom: 0;
	width: 1px;
	background: rgba(0, 85, 255, 0.45);
	pointer-events: none;
	z-index: 1000;
}

/* Shared button style */
.hm-btn {
	position: absolute;
	width: 34px;
	height: 34px;
	border-radius: 50%;
	border: 1.5px solid #0055ff;
	background: transparent;
	color: #0055ff;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	font-size: 0.9rem;
	font-weight: 400;
	line-height: 1;
	z-index: 2;
	padding: 0;
	transition:
		background 0.2s,
		color 0.2s;
}

.hm-btn:hover {
	background: #0055ff;
	color: #fff;
}

/* Glyph keeps the icon centered in the round button */
.hm-btn-glyph {
	display: flex;
	align-items: center;
	justify-content: center;
	line-height: 1;
}

/* Tooltip label below each button, shown on hover/focus */
.hm-btn-label {
	position: absolute;
	top: calc(100% + 6px);
	left: 50%;
	transform: translateX(-50%) translateY(-2px);
	background: #0055ff;
	color: #fff;
	font-size: 0.7rem;
	font-weight: 500;
	letter-spacing: 0.04em;
	padding: 4px 8px;
	border-radius: 4px;
	white-space: nowrap;
	pointer-events: none;
	opacity: 0;
	transition: opacity 0.15s ease, transform 0.15s ease;
	z-index: 3;
}
.hm-btn:hover .hm-btn-label,
.hm-btn:focus-visible .hm-btn-label {
	opacity: 1;
	transform: translateX(-50%) translateY(0);
}

/* Diagonal line at 30°, sits behind the circle.
   Middle is transparent so the visible end-segments don't touch
   the rotating text band that wraps around the circle. */
.hm-diag-line {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 130%;
	height: 1.5px;
	background: linear-gradient(
		to right,
		#0055ff 0%,
		#0055ff 11%,
		transparent 11%,
		transparent 89%,
		#0055ff 89%,
		#0055ff 100%
	);
	transform: translate(-50%, -50%) rotate(120deg);
	pointer-events: none;
	z-index: 0;
}

/* + button: below container, above − */
.hm-btn-in {
	right: 2%;
	bottom: 0px;
}

/* − button: below container, below + */
.hm-btn-out {
	right: 2%;
	bottom: -42px;
}

/* ⌖ locate button: below container, above → */
.hm-btn-locate {
	left: 2%;
	bottom: 0px;
}

/* → select location button: below container, left corner */
.hm-btn-select {
	left: 2%;
	bottom: -42px;
}

</style>
