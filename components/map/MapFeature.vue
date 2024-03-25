<script setup lang="ts">
import type { Feature } from 'geojson';
import tinycolor from 'tinycolor2';
import wordWrap from 'word-wrap';

const props = defineProps<{
	f: Feature;
	grayRated?: boolean;
}>();

// FIXME feature styling
// FIXME should also accept label

const selFeatureId = ref(0); // FIXME read selected feature ID from store
const isSomeFeatureSelected = computed(() => !!selFeatureId.value);
const isSelected = computed(() => selFeatureId.value === props.f.id);
const isUnselected = computed(() => isSomeFeatureSelected.value && !isSelected.value);
const isHidden = computed(() => props.f.properties?.hidden);

// FIXME filter... maybe on Map level?
/*
// filter
const isFilterActive = this.filteredIds !== null;
const featureIncluded = this.filteredIds?.includes(feature.getId()) || isHidden;
if (isFilterActive && !featureIncluded) {
	return feature.setStyle(() => false); // hide
}
*/

// z-index
const zIndex = computed(() => {
	if (isHidden.value) return -1;
	if (isSelected.value) return 1;
	return 0;
});

// color and opacity
const color = computed(() => {
	if (props.grayRated) {
		const rating = props.f.properties?.rating;
		const isRated = Number.isInteger(rating) && rating !== 0;
		if (isRated) return '#666666';
	}
	return props.f.properties?.color;
});

const opacity100 = computed(() => parseOpacity100(props.f) * (isUnselected.value ? 0.35 : 1));
const fillOpacity100 = computed(
	() => parseFillOpacity100(props.f) * (isUnselected.value ? 0.35 : 1),
);
const textOpacity100 = computed(() => 100 * (isUnselected.value ? 0.8 : 1));
const textOpacity = computed(() => toHex(textOpacity100.value));

function toHex(value100: number) {
	const valueDec = Math.round(value100 * 2.55);
	return valueDec.toString(16).padStart(2, '0');
}

const colorWithOpacity = computed(() => color.value + toHex(opacity100.value));
const polygonFillColor = computed(() => color.value + toHex(fillOpacity100.value));

const textColor = computed(() => {
	let reference = tinycolor.mix('#ffffff', color, opacity100);
	if (props.f.geometry.type === 'Polygon') {
		reference = tinycolor.mix(reference, color, fillOpacity100);
	}
	const isLight = reference.isLight();
	return (isLight ? '#000000' : '#ffffff') + textOpacity;
});

// size
// FIXME need to update when zoom changes
/*
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

const style = new Style({
	stroke: new Stroke({
		lineCap: 'butt',
		lineDash,
		width: featureSize,
	}),
	image: new CircleStyle({
		radius: featureSize * 3,
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
});
 */
</script>

<template>
	<template v-if="f.geometry.type === 'Point'">
		<ol-geom-point :coordinates="f.geometry.coordinates" />
		<ol-style :z-index="zIndex">
			<ol-style-circle :radius="5">
				<ol-style-fill :color="colorWithOpacity" />
				<ol-style-stroke
					:color="null"
					:width="0"
				/>
			</ol-style-circle>
		</ol-style>
	</template>

	<template v-else-if="f.geometry.type === 'LineString'">
		<ol-geom-line-string :coordinates="f.geometry.coordinates" />
		<ol-style :z-index="zIndex">
			<ol-style-stroke
				:color="colorWithOpacity"
				:width="f.properties?.width * 2"
			/>
		</ol-style>
	</template>

	<template v-else-if="f.geometry.type === 'Polygon'">
		<ol-geom-polygon :coordinates="f.geometry.coordinates" />
		<ol-style :z-index="zIndex">
			<ol-style-stroke
				:color="colorWithOpacity"
				:width="f.properties?.width * 2"
			/>
			<ol-style-fill :color="polygonFillColor" />
		</ol-style>
	</template>
</template>
