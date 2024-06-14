<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';
import type { Coordinate } from 'ol/coordinate';
import { getCenter } from 'ol/extent';
import { GeoJSON } from 'ol/format';
import LineString from 'ol/geom/LineString.js';
import { type Style } from 'ol/style';
import tinycolor from 'tinycolor2';
import type { Map } from 'vue3-openlayers';
import wordWrap from 'word-wrap';

const props = defineProps<{
	f: GeoJsonFeature;
	labelOverride?: string;
	grayRated?: boolean;
	showBubble?: boolean;
	visitor?: boolean;
}>();

const { currentZoom, selectedFeatureId, visibleFeatureBubbles } = useStore();

const isSomeFeatureSelected = computed(() => !!selectedFeatureId.value);
const isSelected = computed(() => selectedFeatureId.value === props.f.id);
const isUnselected = computed(() => isSomeFeatureSelected.value && !isSelected.value);
const isHidden = computed(() => props.f.properties?.hidden);

// z-index
const zIndex = computed(() => {
	if (isHidden.value) return -1;
	if (isSelected.value) return 1;
	return 0;
});
function styleOverride(_feature: any, currentStyle: Style) {
	// for some reason ol-style :z-index was buggy for points
	currentStyle.setZIndex(zIndex.value);
	return currentStyle;
}

// color and opacity
const colors = computed(() => {
	let color = props.f.properties?.color || '#000000';
	if (props.grayRated) {
		const rating = props.f.properties?.rating;
		const isRated = Number.isInteger(rating) && rating !== 0;
		if (isRated) color = '#666666';
	}

	const opacity100 = parseOpacity100(props.f) * (isUnselected.value ? 0.35 : 1);
	const fillOpacity100 = parseFillOpacity100(props.f) * (isUnselected.value ? 0.35 : 1);
	const textOpacity100 = 100 * (isUnselected.value ? 0.8 : 1);

	const colorWithOpacity = color + percentToHex(opacity100);
	const polygonFillColor = color + percentToHex(fillOpacity100);

	let reference = tinycolor.mix('#ffffff', color, opacity100);
	if (props.f.geometry.type === 'Polygon') {
		reference = tinycolor.mix(reference, color, fillOpacity100);
	}
	const isLight = reference.isLight();
	const textOpacity = percentToHex(textOpacity100);
	const textColor = (isLight ? '#000000' : '#ffffff') + textOpacity;

	return { colorWithOpacity, polygonFillColor, textColor };
});

// size
const sizes = computed(() => {
	const baseFeatureSize = Math.max(1, Number(props.f.properties?.width) || 1);
	let featureSize = baseFeatureSize;
	if (props.visitor) {
		const isPoint = props.f.geometry.type === 'Point';
		if (!isHidden.value && isSelected.value && !isPoint) featureSize += 5;
	}
	const zoom = currentZoom.value;
	featureSize -= 0.75 * (19 - zoom);
	let fontSize = featureSize * 3.5;
	if (baseFeatureSize < 5) {
		const featureSizeAdj = 5 - baseFeatureSize + 1;
		fontSize += featureSizeAdj * 3.5;
	}
	featureSize = Math.max(2, featureSize);
	return { featureSize, fontSize };
});

// text
const textParams = computed(() => {
	let rotation = 0;
	let text = '';
	if (sizes.value.fontSize >= 8) {
		const isInResultsMode = !!props.labelOverride;
		const angle = Number(props.f.properties?.partimapMapLabelAngle || 0); // deg
		rotation = isInResultsMode ? 0 : angle * (Math.PI / 180); // rad
		text =
			isInResultsMode && !isHidden.value
				? props.labelOverride
				: props.f.properties?.partimapMapLabel;
		text = wordWrap(text || '', {
			indent: '',
			trim: true,
			width: 25, // chars
		});
	}

	const font = `bold ${sizes.value.fontSize}px sans-serif`;
	return { font, rotation, text };
});

// line style
const lineDash = computed(() => {
	const dash = props.f.properties?.dash || '0';
	return dash.split(',').map((w: string) => Number(w) * sizes.value.featureSize);
});

const stylePresent = ref(true);
const polygonFillColor = computed(() => colors.value.polygonFillColor);
watch([polygonFillColor, lineDash], () => {
	// ol-style-stroke :line-dash and ol-style-fill :color was not reactive for polygons
	// so we recreate the style basically to redraw it on map
	stylePresent.value = false;
	nextTick(() => (stylePresent.value = true));
});

// bubble

const isDescriptionEmpty = computed(
	() => !(props.f.properties?.description || '').replace(/<.*?>/g, '').trim(),
);

const overlay = ref<InstanceType<typeof Map.OlOverlay>>();

const overlayCenter = computed<Coordinate>(() => {
	const f = props.f;
	if (f.geometry.type === 'Point') return f.geometry.coordinates;

	const olf = new GeoJSON().readFeature(props.f);
	if (!olf.getGeometry()) return [0, 0];

	if (olf.getGeometry()?.getType() === 'LineString') {
		const g = olf.getGeometry() as LineString;
		return g.getCoordinateAt(0.5);
	}

	return getCenter(olf.getGeometry()!.getExtent());
});

const overlayOffset = computed(() => {
	if (props.f.geometry.type !== 'Point') return [0, 0];
	return [0, sizes.value.featureSize * 3.25];
});

watchEffect(() => {
	if (!overlay.value) return;
	overlay.value.$el.parentElement.style.zIndex = `${zIndex.value}`;
});

function closeBubble() {
	const id = Number(props.f.id);
	if (visibleFeatureBubbles.value.includes(id)) {
		visibleFeatureBubbles.value = visibleFeatureBubbles.value.filter((i) => i !== id);
	}
}
</script>

<template>
	<ol-feature :properties="{ id: f.id }">
		<ol-geom-point
			v-if="f.geometry.type === 'Point'"
			:coordinates="f.geometry.coordinates"
		/>
		<ol-geom-line-string
			v-else-if="f.geometry.type === 'LineString'"
			:coordinates="f.geometry.coordinates"
		/>
		<ol-geom-polygon
			v-else-if="f.geometry.type === 'Polygon'"
			:coordinates="f.geometry.coordinates"
		/>

		<ol-style
			v-if="stylePresent"
			:override-style-function="styleOverride"
		>
			<template v-if="f.geometry.type === 'Point'">
				<ol-style-circle :radius="sizes.featureSize * 3">
					<ol-style-fill :color="colors.colorWithOpacity" />
					<ol-style-stroke
						:color="null"
						:width="0"
					/>
				</ol-style-circle>
			</template>
			<template v-else>
				<!-- LineString or Polygon -->
				<ol-style-stroke
					:color="colors.colorWithOpacity"
					line-cap="butt"
					:line-dash="lineDash"
					:width="sizes.featureSize"
				/>
			</template>

			<ol-style-fill
				v-if="f.geometry.type === 'Polygon'"
				:color="colors.polygonFillColor"
			/>

			<ol-style-text
				:background-fill="colors.colorWithOpacity"
				:fill="colors.textColor"
				:font="textParams.font"
				:offset-y="1"
				:overflow="true"
				:padding="[3, 3, 3, 3]"
				placement="point"
				:rotation="textParams.rotation"
				:text="showBubble ? '' : textParams.text"
			/>
		</ol-style>

		<ol-overlay
			v-if="showBubble && !isDescriptionEmpty"
			ref="overlay"
			auto-pan
			:offset="overlayOffset"
			:position="overlayCenter"
			positioning="top-center"
		>
			<div
				class="popover rounded-1 shadow-sm"
				style="width: 250px"
				:style="{ borderColor: colors.colorWithOpacity }"
			>
				<div
					class="d-flex align-items-center"
					style="height: 30px"
					:style="{ backgroundColor: colors.colorWithOpacity, color: colors.textColor }"
				>
					<div class="flex-grow-1 fw-bold mx-1 text-truncate">
						{{ f.properties?.name }}
					</div>
					<div
						role="button"
						class="d-flex h-100 ms-1 px-1"
						@click="closeBubble"
					>
						<i
							class="fas fa-fw fa-times m-auto"
							style="font-size: 1.35rem; height: 1.35rem"
						/>
					</div>
				</div>
				<div
					class="rich h-100 overflow-y-auto p-2"
					style="max-height: 33vh; scrollbar-gutter: stable"
					v-html="f.properties?.description"
				/>
			</div>
		</ol-overlay>
	</ol-feature>
</template>
