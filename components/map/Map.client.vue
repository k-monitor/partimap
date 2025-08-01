<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';
import type { Feature as OlFeature, Map, MapBrowserEvent, View } from 'ol';
import type { Coordinate } from 'ol/coordinate';
import type { Extent } from 'ol/extent';
import { GeoJSON } from 'ol/format';
import type { DragBoxEvent } from 'ol/interaction/DragBox';
import type { ObjectEvent } from 'ol/Object';
import { transform } from 'ol/proj';
import type { Vector } from 'ol/source';
import { Circle, Fill, Stroke, Style } from 'ol/style';

const props = defineProps<{
	features?: GeoJsonFeature[];
	fitSelected?: boolean;
	grayRated?: boolean;
	labelOverrides?: Record<string, string>;
	showBubbles?: boolean;
	viewExtent?: Extent;
	visitor?: boolean;
}>();

const {
	changeBaseMap,
	currentDrawingInteraction,
	currentZoom,
	drawType,
	filteredFeatureIds,
	selectedFeatureId,
	sidebarVisible,
	visibleFeatureBubbles,
} = useStore();

// map initialization

const GOOGLEMAPS_PROJECTION = 'EPSG:4326';
const PARTIMAP_PROJECTION = 'EPSG:3857'; // OL default

const { t } = useI18n();
const coords = t('Map.initialCenter').split(',');
const gm2ol = (coords: number[]) => transform(coords, GOOGLEMAPS_PROJECTION, PARTIMAP_PROJECTION);
const initialCenter = gm2ol(coords.reverse().map((p) => Number(p)));
const initialZoom = Number(t('Map.initialZoom')) || 10;

onBeforeMount(() => {
	filteredFeatureIds.value = null;
	selectedFeatureId.value = null;
	visibleFeatureBubbles.value = [];
});

function handleResolutionChange(e: ObjectEvent) {
	currentZoom.value = (e.target as View).getZoom() || 0;
}

const interactions = inject<Ref<Interactions | null>>('interactions', ref(null));
watchEffect(() => {
	if (interactions.value?.baseMap) changeBaseMap(interactions.value?.baseMap);
});

// fit to features

const viewRef = ref<{ view: View }>();
const sourceRef = ref<{ source: Vector }>();

function fitViewToFeatures(immediate?: boolean) {
	const olFeatures = sourceRef.value?.source.getFeatures();
	if (!olFeatures || !olFeatures.length) return;

	// fit to selected feature or all features
	let selectedFeature: OlFeature | undefined = undefined;
	if (selectedFeatureId.value) {
		selectedFeature = olFeatures.find(
			(f) => String(f.get('id') || '') === selectedFeatureId.value,
		);
	}
	const extent = selectedFeature
		? selectedFeature?.getGeometry()?.getExtent()
		: sourceRef.value?.source.getExtent();

	if (!extent) return;
	viewRef.value?.view.fit(extent, {
		duration: immediate ? 0 : 200,
		padding: [80, 80, 80, 80],
	});
}

onMounted(async () => {
	await nextTick(); // wait for OL to have the features
	fitViewToFeatures(true);
});

watch([selectedFeatureId, sidebarVisible], async (current, previous) => {
	if (current[0] && !current[1]) {
		// feature has selected, but sidebar is not yet opening
		// NOP, to prevent redundant fitting and visible zoom in-out
		return;
	}

	if (current[1] && !previous[1]) {
		// sidebar is opening now, but it has transition
		// need to wait for it to end to prevent fitting with
		// incorrect Map size
		window.setTimeout(fitViewToFeatures, 300);
	} else {
		fitViewToFeatures();
	}
});
// TODO add filteredFeatureIds too?

// filter

const visibleFeatures = computed(() => {
	const isFilterActive = filteredFeatureIds.value !== null;
	return (props.features || []).filter((f) => {
		const isHidden = f.properties?.hidden;
		const included = (filteredFeatureIds.value || []).includes(String(f.id || '')) || isHidden;
		if (isFilterActive && !included) return false;
		return true;
	});
});

// select

function getFeaturePropertiesAtPixel(e: MapBrowserEvent<UIEvent>) {
	const map = e.target as Map;
	const candidates = map.getFeaturesAtPixel(e.pixel);
	const active = candidates.find((f) => !f.get('hidden'));
	const hidden = candidates.find((f) => f.get('hidden'));
	return active?.getProperties() || hidden?.getProperties() || null;
}

function handlePointermove(e: MapBrowserEvent<UIEvent>) {
	if (drawType.value) return;

	const fp = getFeaturePropertiesAtPixel(e);
	const isActive =
		!!fp && isFeatureActive(fp, !props.visitor, !!isItInteractive(interactions?.value));

	const map = e.target as Map;
	map.getTargetElement().style.cursor = isActive ? 'pointer' : '';
}

const { emitSelectAttempt } = useSelectAttempt();

function handleClick(e: MapBrowserEvent<UIEvent>) {
	if (drawType.value) return;

	const id = getFeaturePropertiesAtPixel(e)?.id || false; // see MapFeature :properties

	const feature = props.features?.find((f) => f.id === id);
	emitSelectAttempt(feature || null);

	// show bubble if needed
	if (!props.showBubbles || !feature) return;
	if (visibleFeatureBubbles.value.includes(String(feature.id || ''))) return;
	if (feature.properties?.visitorFeature) return;
	if (isFeatureDescriptionEmpty(feature.properties?.description)) return;
	visibleFeatureBubbles.value = [...visibleFeatureBubbles.value, String(feature.id)];
}

// draw

watch(drawType, (dt) => {
	if (dt) selectedFeatureId.value = null;
});

const drawSourceRef = ref<{ source: Vector }>();

function drawingStyleOverride(f: OlFeature) {
	if (!currentDrawingInteraction.value) return;

	// Will be called with Point, LineString and Polygon too.
	const g = f.getGeometry()?.getType() || '';

	if (g === 'Point') {
		// Point geometry under cursor
		return new Style({
			image: new Circle({
				fill: new Fill({ color: currentDrawingInteraction.value.color }),
				radius: 6, // intentionally not multiplying by 3 as in MapFeature
				stroke: new Stroke({
					color: '#ffffff',
					width: 1,
				}),
			}),
		});
	}

	if (g === 'LineString') {
		// Line geometry of line or polygon border drawn so far
		return [
			new Style({
				stroke: new Stroke({
					color: '#ffffff',
					width: 7,
				}),
			}),
			new Style({
				stroke: new Stroke({
					color: currentDrawingInteraction.value.color,
					width: 5,
				}),
			}),
		];
	}

	if (g === 'Polygon') {
		// Polygon geometry of polygon drawn so far
		return new Style({
			fill: new Fill({
				color: '#ffffff80',
			}),
		});
	}
}

const emit = defineEmits<{
	(e: 'extentDrawn', extent: Extent): void;
	(e: 'featureDrawn', feature: GeoJsonFeature): void;
}>();

async function handleDrawEnd() {
	await nextTick(); // wait for source to be updated

	const source = drawSourceRef.value?.source;
	if (!source) return;

	const olFeature = source.getFeatures()[0];
	if (!olFeature) return;

	const geoJsonFeatureStr = new GeoJSON().writeFeature(olFeature);
	const feature = JSON.parse(geoJsonFeatureStr);
	feature.id = Date.now();

	feature.properties = {
		color: currentDrawingInteraction.value?.color,
		extraStroke: DEFAULT_EXTRA_STROKE,
		opacity: 100,
		width: 6,
	};
	if (drawType.value === 'Polygon') feature.properties.fillOpacity = 10;
	if (['LineString', 'Polygon'].includes(drawType.value)) feature.properties.dash = '0';

	if (props.visitor) {
		feature.properties = {
			...feature.properties,
			descriptionLabel: currentDrawingInteraction.value?.descriptionLabel || '',
			extraStroke: DEFAULT_EXTRA_STROKE_FOR_VISITORS,
			featureLabel: currentDrawingInteraction.value?.featureLabel || '',
			visitorFeature: currentDrawingInteraction.value?.id || true,
		};
	}

	drawType.value = '';
	source.clear();

	emit('featureDrawn', feature);

	await nextTick(); // wait for FLE to be created
	const timeout = isMobile() ? 500 : 0;
	setTimeout(() => emitSelectAttempt(feature), timeout);
}

const boxStartCoordinates = ref<Coordinate>([0, 0]);

function handleBoxStart({ coordinate }: DragBoxEvent) {
	boxStartCoordinates.value = coordinate;
}

function handleBoxEnd({ coordinate }: DragBoxEvent) {
	drawType.value = '';
	const [x1, y1] = boxStartCoordinates.value;
	const [x2, y2] = coordinate;
	const extent: Extent = [Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2)];
	emit('extentDrawn', extent);
}

watchEffect(async () => {
	if (!props.viewExtent) {
		await nextTick();
		fitViewToFeatures();
	}
});

// snap

const snapEnabled = ref(false);
watch(drawType, async (t) => {
	await nextTick(); // wait for draw interaction to be ready
	snapEnabled.value = !!t;
});
</script>

<template>
	<ol-map
		:load-tiles-while-animating="true"
		:load-tiles-while-interacting="true"
		style="height: 100%"
		@click="handleClick"
		@pointermove="handlePointermove"
	>
		<ol-view
			ref="viewRef"
			:center="initialCenter"
			:extent="viewExtent"
			max-zoom="19"
			:zoom="initialZoom"
			:projection="PARTIMAP_PROJECTION"
			@change:resolution="handleResolutionChange"
		/>

		<BaseMaps />

		<ol-vector-layer>
			<ol-source-vector ref="sourceRef">
				<MapFeature
					v-for="f in visibleFeatures"
					:key="f.id"
					:f="f"
					:gray-rated="grayRated"
					:label-override="(labelOverrides || {})[String(f.id || '')] || ''"
					:show-bubble="showBubbles && visibleFeatureBubbles.includes(String(f.id || ''))"
					:visitor="visitor"
				/>
				<ol-interaction-snap v-if="snapEnabled" />
			</ol-source-vector>
		</ol-vector-layer>

		<ol-vector-layer>
			<ol-source-vector ref="drawSourceRef">
				<template v-if="currentDrawingInteraction && drawType">
					<ol-interaction-draw
						v-if="drawType !== 'box'"
						:type="drawType"
						@drawend="handleDrawEnd"
					>
						<ol-style :override-style-function="drawingStyleOverride" />
					</ol-interaction-draw>
					<ol-interaction-dragbox
						v-else
						@boxend="handleBoxEnd"
						@boxstart="handleBoxStart"
					/>
				</template>
			</ol-source-vector>
		</ol-vector-layer>

		<MapControls />
	</ol-map>
</template>

<style>
.ol-dragbox {
	background: transparent;
	border: 2px solid black;
	box-shadow: 0 0 0 10000px rgb(0, 0, 0, 0.25);
}
</style>
