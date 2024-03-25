<script setup lang="ts">
import type { Feature } from 'geojson';

defineProps<{
	f: Feature;
}>();

// FIXME feature styling
// FIXME should also accept label
/*
const isSomeFeatureSelected = !!selFeature;
const isSelected = selFeature?.getId() === feature.getId();
const isUnselected = isSomeFeatureSelected && !isSelected;
const isHidden = feature.get('hidden');

// filter
const isFilterActive = this.filteredIds !== null;
const featureIncluded = this.filteredIds?.includes(feature.getId()) || isHidden;
if (isFilterActive && !featureIncluded) {
	return feature.setStyle(() => false); // hide
}

// z-index
let zIndex = 0;
if (isHidden) zIndex = -1;
else if (isSelected) zIndex = 1;

// color and opacity
let color = feature.get('color');
if (this.grayRated) {
	const rating = feature.get('rating');
	const isRated = Number.isInteger(rating) && rating !== 0;
	if (isRated) color = '#666666';
}

const opacity100 = parseOpacity100(feature) * (isUnselected ? 0.35 : 1);
const fillOpacity100 = parseFillOpacity100(feature) * (isUnselected ? 0.35 : 1);

const textOpacity100 = 100 * (isUnselected ? 0.8 : 1);
function toHex(value100) {
	const valueDec = Math.round(value100 * 2.55);
	return valueDec.toString(16).padStart(2, '0');
}
const opacityHex = toHex(opacity100);
const fillOpacityHex = toHex(fillOpacity100);
const colorWithOpacity = color + opacityHex;
const polygonFillColor = color + fillOpacityHex;

let reference = tinycolor.mix('#ffffff', color, opacity100);
if (feature.getGeometry().getType() === 'Polygon') {
	reference = tinycolor.mix(reference, color, fillOpacity100);
}
const isLight = reference.isLight();
const textOpacity = toHex(textOpacity100);
const textColor = (isLight ? '#000000' : '#ffffff') + textOpacity;

// size
const baseFeatureSize = Math.max(1, Number(feature.get('width') || 1));
let featureSize = baseFeatureSize;
if (this.visitor) {
	const isPoint = feature.getGeometry().getType() === 'Point';
	if (!isHidden && isSelected && !isPoint) featureSize += 5;
}
const zoom = this.view.getZoom();
featureSize -= 0.75 * (19 - zoom);
let fontSize = featureSize * 3.5;
if (baseFeatureSize < 5) {
	const featureSizeAdj = 5 - baseFeatureSize + 1;
	fontSize += featureSizeAdj * 3.5;
}
featureSize = Math.max(2, featureSize);

// text
let rotation = 0;
let text = '';
if (fontSize >= 8) {
	const isInResultsMode = Object.keys(this.labels || {}).length;
	const angle = Number(feature.get('partimapMapLabelAngle') || 0); // deg
	rotation = isInResultsMode ? 0 : angle * (Math.PI / 180); // rad
	text =
		isInResultsMode && !isHidden
			? this.labels[feature.id_]
			: feature.get('partimapMapLabel');
	text = wordWrap(text || '', {
		indent: '',
		trim: true,
		width: 25, // chars
	});
}

// line style
const lineDash = (feature.get('dash') || '1')
	.split(',')
	.map((w) => Number(w) * featureSize);

function fill(color) {
	if (!color) return null;
	return new Fill({ color });
}

const style = new Style({
	geometry(feature) {
		return feature.getGeometry();
	},
	fill: fill(polygonFillColor),
	stroke: new Stroke({
		color: colorWithOpacity,
		lineCap: 'butt',
		lineDash,
		width: featureSize,
	}),
	image: new CircleStyle({
		radius: featureSize * 3,
		fill: fill(colorWithOpacity),
	}),
	text: new Text({
		font: `bold ${fontSize}px sans-serif`,
		text,
		placement: 'point',
		backgroundFill: fill(colorWithOpacity),
		fill: fill(textColor),
		offsetY: 1,
		overflow: true,
		padding: [3, 3, 3, 3],
		rotation,
	}),
	zIndex,
});
 */
</script>

<template>
	<template v-if="f.geometry.type === 'Point'">
		<ol-geom-point :coordinates="f.geometry.coordinates" />
		<ol-style>
			<ol-style-circle :radius="5">
				<ol-style-fill :color="f.properties?.color" />
			</ol-style-circle>
		</ol-style>
	</template>

	<template v-else-if="f.geometry.type === 'LineString'">
		<ol-geom-line-string :coordinates="f.geometry.coordinates" />
		<ol-style>
			<ol-style-stroke
				:color="f.properties?.color"
				:width="f.properties?.width * 2"
			/>
		</ol-style>
	</template>

	<template v-else-if="f.geometry.type === 'Polygon'">
		<ol-geom-polygon :coordinates="f.geometry.coordinates" />
		<ol-style>
			<ol-style-stroke
				:color="f.properties?.color"
				:width="f.properties?.width * 2"
			/>
			<ol-style-fill :color="f.properties?.color" />
		</ol-style>
	</template>
</template>
