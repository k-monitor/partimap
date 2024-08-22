<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';
import type { Feature as OlFeature } from 'ol';
import type { Coordinate } from 'ol/coordinate';
import { getCenter } from 'ol/extent';
import { GeoJSON } from 'ol/format';
import LineString from 'ol/geom/LineString.js';
import { Circle, Fill, Stroke, Style, Text } from 'ol/style';
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
const isSelected = computed(() => selectedFeatureId.value === String(props.f.id || ''));
const isUnselected = computed(() => isSomeFeatureSelected.value && !isSelected.value);
const isHidden = computed(() => props.f.properties?.hidden);

const extraStroke = computed(() => {
	const es = props.f.properties?.extraStroke;
	if (props.f.properties?.visitorFeature) {
		return isSelected.value ? 'wh' : DEFAULT_EXTRA_STROKE_FOR_VISITORS;
	}
	return es || DEFAULT_EXTRA_STROKE;
});

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

	let extraStrokeBaseColor = '#000000'; // bk or gr
	if (extraStroke.value.includes('wh')) extraStrokeBaseColor = '#ffffff';
	else if (extraStroke.value.includes('own')) extraStrokeBaseColor = color;
	const extraStrokeBaseOpacity =
		extraStroke.value.includes('gr') || extraStroke.value.includes('own') ? 0.25 : 1;
	const extraStrokeColor =
		extraStrokeBaseColor +
		percentToHex(isUnselected.value ? 0 : opacity100 * extraStrokeBaseOpacity);

	const polygonExtraStrokeColor =
		extraStrokeBaseColor +
		percentToHex(isUnselected.value ? 0 : fillOpacity100 * extraStrokeBaseOpacity);

	return {
		colorWithOpacity,
		extraStrokeColor,
		polygonExtraStrokeColor,
		polygonFillColor,
		textColor,
	};
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
	fontSize = Math.max(MIN_FONT_SIZE_PX, fontSize);
	return { featureSize, fontSize };
});

// text
const textParams = computed(() => {
	let rotation = 0;
	let text = '';
	if (sizes.value.fontSize > MIN_FONT_SIZE_PX) {
		const angle = Number(props.f.properties?.partimapMapLabelAngle || 0); // deg
		rotation = angle * (Math.PI / 180); // rad
		text = props.f.properties?.partimapMapLabel || '';
	}

	const isInResultsMode = !!props.labelOverride;
	if (isInResultsMode && !isHidden.value) {
		rotation = 0;
		text = props.labelOverride;
	}

	text = wordWrap(text || '', {
		indent: '',
		trim: true,
		width: 25, // chars
	});

	const font = `bold ${sizes.value.fontSize}px sans-serif`;
	return { font, rotation, text };
});

// line style
const lineDash = computed(() => {
	const dash = props.f.properties?.dash || '0';
	return dash.split(',').map((w: string, i: number) => {
		const s = i % 2 == 1 ? 2 : 1; // increase space between line sections
		return Number(w) * s * sizes.value.featureSize;
	});
});

// z-index
const zIndex = computed(() => {
	let z = 0;

	const g = props.f.geometry.type;
	// Polygon stays at 0
	if (g.includes('LineString')) z += 1;
	if (g.includes('Point')) z += 2;

	if (isHidden.value) z -= 10;
	if (isSelected.value) z += 10;
	return z;
});

function styleOverride(f: OlFeature) {
	const g = f.getGeometry()?.getType() || '';
	const hasExtraStroke = extraStroke.value !== 'no';
	const thickExtraStroke = extraStroke.value.includes('2');
	const doubleExtraStroke = extraStroke.value.startsWith('d');

	const createFill = (color: string) => new Fill({ color });
	const createStroke = (color: string, extraWidth = 0) =>
		new Stroke({
			color,
			lineCap: doubleExtraStroke ? 'butt' : undefined,
			lineDash: lineDash.value,
			width: sizes.value.featureSize + extraWidth,
		});
	const createSimpleStroke = (color: string, width = 1) => new Stroke({ color, width });

	const text = new Text({
		backgroundFill: createFill(colors.value.colorWithOpacity),
		backgroundStroke: hasExtraStroke
			? createSimpleStroke(colors.value.extraStrokeColor, thickExtraStroke ? 5 : 1)
			: undefined,
		fill: createFill(colors.value.textColor),
		font: textParams.value.font,
		offsetY: 1,
		overflow: true,
		padding: [3, 3, 3, 3],
		placement: 'point',
		rotation: textParams.value.rotation,
		// hide text when bubble is opened
		text: props.showBubble ? '' : textParams.value.text,
	});

	const styles: Style[] = [];

	if (g.includes('Point')) {
		// hide point if it has label
		// hide point also if bubble is opened
		const radius = props.showBubble || textParams.value.text ? 0 : sizes.value.featureSize * 3;

		if (thickExtraStroke) {
			// needs to be below colored fill
			styles.push(
				new Style({
					image: new Circle({
						radius,
						stroke: createSimpleStroke(colors.value.extraStrokeColor, 5),
					}),
				}),
			);
		}
		styles.push(
			new Style({
				image: new Circle({
					fill: createFill(colors.value.colorWithOpacity),
					radius,
					stroke:
						hasExtraStroke && !thickExtraStroke
							? createSimpleStroke(colors.value.extraStrokeColor, 1)
							: undefined,
				}),
			}),
		);
	}

	if (g.includes('Polygon')) {
		if (hasExtraStroke) {
			// with this we can make similar styles to points if fillOpacity is 100
			styles.push(
				new Style({
					stroke: createStroke(
						colors.value.polygonExtraStrokeColor,
						thickExtraStroke ? 5 : 2,
					),
				}),
			);
		}
		styles.push(
			new Style({
				fill: createFill(colors.value.polygonFillColor),
			}),
		);
	}

	if (g.includes('LineString') || g.includes('Polygon')) {
		if (hasExtraStroke) {
			styles.push(
				new Style({
					stroke: createStroke(colors.value.extraStrokeColor, thickExtraStroke ? 5 : 2),
				}),
			);
		}
		styles.push(
			new Style({
				stroke: createStroke(colors.value.colorWithOpacity),
			}),
		);
		if (doubleExtraStroke) {
			// we add a white stroke in the middle with 25% width
			styles.push(
				new Style({
					stroke: createStroke(
						colors.value.extraStrokeColor,
						-sizes.value.featureSize + Math.max(1, sizes.value.featureSize / 4),
					),
				}),
			);
		}
	}

	styles.forEach((s) => s.setZIndex(zIndex.value));

	styles.push(
		new Style({
			text,
			zIndex: zIndex.value + 5,
		}),
	);

	return styles;
}

// bubble

const isDescriptionEmpty = computed(() =>
	isFeatureDescriptionEmpty(props.f.properties?.description),
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
	const bubbleOrd = visibleFeatureBubbles.value.indexOf(String(props.f.id || ''));
	overlay.value.$el.parentElement.style.zIndex = bubbleOrd + 2;
});

function closeBubble() {
	const id = String(props.f.id || '');
	if (visibleFeatureBubbles.value.includes(id)) {
		visibleFeatureBubbles.value = visibleFeatureBubbles.value.filter((i) => i !== id);
	}
}
</script>

<template>
	<ol-feature :properties="{ id: f.id, ...f.properties }">
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
		<ol-geom-multi-point
			v-else-if="f.geometry.type === 'MultiPoint'"
			:coordinates="f.geometry.coordinates"
		/>
		<ol-geom-multi-line-string
			v-else-if="f.geometry.type === 'MultiLineString'"
			:coordinates="f.geometry.coordinates"
		/>
		<ol-geom-multi-polygon
			v-else-if="f.geometry.type === 'MultiPolygon'"
			:coordinates="f.geometry.coordinates"
		/>

		<ol-style
			:key="`${f.id}/${showBubble}`"
			:override-style-function="styleOverride"
		/>

		<ol-overlay
			v-if="showBubble && !isDescriptionEmpty"
			ref="overlay"
			auto-pan
			:offset="overlayOffset"
			:position="overlayCenter"
			positioning="top-center"
		>
			<div
				class="popover rounded-1"
				style="width: 250px"
				:style="{
					borderColor: tinycolor(colors.colorWithOpacity).toRgbString(),
					boxShadow: '0px 10px 20px -5px rgba(0,0,0,0.75)',
				}"
			>
				<div
					class="d-flex align-items-center"
					style="height: 30px"
					:style="{
						backgroundColor: tinycolor(colors.colorWithOpacity).toRgbString(),
						color: tinycolor(colors.textColor).toRgbString(),
					}"
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
				<TipTapDisplay
					:key="f.properties?.description"
					class="overflow-y-auto p-2"
					style="max-height: 33vh; scrollbar-gutter: stable"
					:html="f.properties?.description"
				/>
			</div>
		</ol-overlay>
	</ol-feature>
</template>
