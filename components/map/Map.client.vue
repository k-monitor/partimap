<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';
import type { Feature as OlFeature, Map, MapBrowserEvent, View } from 'ol';
import type { ObjectEvent } from 'ol/Object';
import { GeoJSON } from 'ol/format';
import { transform } from 'ol/proj';
import type { Vector } from 'ol/source';

const props = defineProps<{
	features?: GeoJsonFeature[];
	fitSelected?: boolean;
	grayRated?: boolean;
	labelOverrides?: Record<number, string>;
	visitor?: boolean;
}>();

const {
	changeBaseMap,
	currentZoom,
	drawType,
	filteredFeatureIds,
	selectedFeatureId,
	sidebarVisible,
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
	selectedFeatureId.value = null;
});

function handlePointermove(e: MapBrowserEvent<UIEvent>) {
	if (drawType.value) return;

	const map = e.target as Map;
	const hit = map.getFeaturesAtPixel(e.pixel).find((f) => !f.get('hidden'));
	map.getTargetElement().style.cursor = hit ? 'pointer' : '';
}

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
		selectedFeature = olFeatures.find((f) => f.getId() === selectedFeatureId.value);
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

watch([selectedFeatureId, sidebarVisible], () => fitViewToFeatures());
// TODO add filteredFeatureIds too?

// filter

const visibleFeatures = computed(() => {
	const isFilterActive = filteredFeatureIds.value !== null;
	return (props.features || []).filter((f) => {
		const isHidden = f.properties?.hidden;
		const included = (filteredFeatureIds.value || []).includes(Number(f.id)) || isHidden;
		if (isFilterActive && !included) return false;
		return true;
	});
});

// select

const { emitSelectAttempt } = useSelectAttempt();

function handleClick(e: MapBrowserEvent<UIEvent>) {
	if (drawType.value) return;

	const map = e.target as Map;
	const clicked = map.getFeaturesAtPixel(e.pixel);
	const active = clicked.find((f) => !f.get('hidden'));
	const hidden = clicked.find((f) => f.get('hidden'));
	const id = active?.get('id') || hidden?.get('id'); // see MapFeature :properties

	const feature = props.features?.find((f) => f.id === id);
	emitSelectAttempt(feature || null);
}

// draw

watch(drawType, (dt) => {
	if (dt) selectedFeatureId.value = null;
});

const drawSourceRef = ref<{ source: Vector }>();

const emit = defineEmits<{
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

	const defaultColors: Record<DrawType, string> = {
		'': '',
		Point: '#F44336',
		LineString: '#3F51B5',
		Polygon: '#49a238',
	};
	feature.properties = {
		color: defaultColors[drawType.value],
		opacity: 100,
		width: 6,
	};
	if (drawType.value === 'Polygon') feature.properties.fillOpacity = 10;
	if (['LineString', 'Polygon'].includes(drawType.value)) feature.properties.dash = '0';
	if (props.visitor) feature.properties.visitorFeature = true;

	drawType.value = '';
	source.clear();

	emit('featureDrawn', feature);

	await nextTick(); // wait for FLE to be created
	const timeout = isMobile() ? 500 : 0;
	setTimeout(() => emitSelectAttempt(feature), timeout);
}
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
					:label-override="(labelOverrides || {})[Number(f.id)] || ''"
					:visitor="visitor"
				/>
			</ol-source-vector>
		</ol-vector-layer>

		<ol-vector-layer>
			<ol-source-vector ref="drawSourceRef">
				<ol-interaction-draw
					v-if="drawType"
					:type="drawType"
					@drawend="handleDrawEnd"
				/>
			</ol-source-vector>
		</ol-vector-layer>

		<MapControls />
	</ol-map>
</template>

<style>
.ol-zoom {
	display: none;
}
</style>
