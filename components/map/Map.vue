<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';
import type { Feature as OlFeature, View } from 'ol';
import type { ObjectEvent } from 'ol/Object';
import { transform } from 'ol/proj';
import type { Vector } from 'ol/source';

const props = defineProps<{
	features?: GeoJsonFeature[];
	fitSelected?: boolean;
	grayRated?: boolean;
	initialBaseMapKey?: string;
	labelOverrides?: Record<number, string>;
	visitor?: boolean;
}>();

const { changeBaseMap, currentZoom, filteredFeatureIds, selectedFeatureId, sidebarVisible } =
	useStore();

// map initialization

const GOOGLEMAPS_PROJECTION = 'EPSG:4326';
const PARTIMAP_PROJECTION = 'EPSG:3857'; // OL default

const { t } = useI18n();
const coords = t('Map.initialCenter').split(',');
const gm2ol = (coords: number[]) => transform(coords, GOOGLEMAPS_PROJECTION, PARTIMAP_PROJECTION);
const initialCenter = gm2ol(coords.reverse().map((p) => Number(p)));
const initialZoom = Number(t('Map.initialZoom')) || 10;

onBeforeMount(() => {
	changeBaseMap(props.initialBaseMapKey || 'osm');
	selectedFeatureId.value = null;
});

function updateCurrentZoom(e: ObjectEvent) {
	currentZoom.value = (e.target as View).getZoom() || 0;
}

// fit to features

const viewRef = ref<{ view: View }>();
const sourceRef = ref<{ source: Vector }>();

function fitViewToFeatures() {
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
		duration: 200,
		padding: [80, 80, 80, 80],
	});
}

onMounted(async () => {
	await nextTick(); // wait for OL to have the features
	fitViewToFeatures();
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

// FIXME

/*
export default {
	data() {
		return {
			// default color for drawn features
			defaultColor: {
				drawing: '#607D8B',
				Point: '#F44336',
				LineString: '#3F51B5',
				Polygon: '#49a238',
			},
			defaultStroke: {
				lineDash: '0',
				width: 6,
			},
		};
	},
	watch: {
		drawType(type) {
			// when drawing, feature selection is disabled
			if (type) {
				this.$store.commit('selected/clear');
			}

			// set draw type on OL map
			this.map.removeInteraction(this.draw);
			this.map.removeInteraction(this.snap);
			if (type) {
				this.draw = new Draw({
					source: this.source,
					type,
				});
				this.map.addInteraction(this.draw);
				this.snap = new Snap({
					source: this.source,
				});
				this.map.addInteraction(this.snap);
			}
		},
	},
	created() {
		this.$nuxt.$on('importedFeatures', (features) => {
			this.$store.commit('selected/clear');
			// TODO would be nice to remove/overwrite already existing feature by ID
			features.forEach((f) => this.vector.getSource().addFeature(f));
			this.fitViewToFeatures();
		});
	},
	beforeUnmount() {
		this.$nuxt.$off('clearFeature');
		this.$nuxt.$off('clearFeatures');
		this.$nuxt.$off('changeStyle');
		this.$nuxt.$off('importedFeatures');
		this.$nuxt.$off('filterFeatures');
	},
	methods: {
		addEventListeners() {
			this.map.on('click', (e) => {
				if (this.drawType) return;
				const clicked = this.map.getFeaturesAtPixel(e.pixel);
				const active = clicked.find((f) => !f.get('hidden'));
				const hidden = clicked.find((f) => f.get('hidden'));
				this.$nuxt.$emit('selectAttempt', active || hidden); // feature or null
			});

			this.map.on('pointermove', (e) => {
				const hit = this.map.getFeaturesAtPixel(e.pixel).find((f) => !f.get('hidden'));
				this.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
			});

			this.source.on('addfeature', (e) => {
				const f = e.feature;
				if (!f.getId()) {
					f.setId(new Date().getTime());
				}

				const drawing = !!this.drawType; // otherwise importing
				if (drawing) {
					// drawn feature
					this.changeFeatureStyle(
						f,
						this.defaultColor[this.drawType] || this.defaultColor.drawing,
						this.defaultStroke.lineDash,
						10,
						100,
						this.defaultStroke.width,
						true,
					);
				} else {
					// imported feature
					const fillOpacity = parseFillOpacity100(f);
					const opacity = parseOpacity100(f);
					this.changeFeatureStyle(
						f,
						f.get('color') || this.defaultColor.drawing,
						f.get('dash') || this.defaultStroke.lineDash,
						fillOpacity,
						opacity,
						f.get('width') || this.defaultStroke.width,
						false,
					);
				}

				this.$store.commit('setDrawType', '');
				this.$store.commit('features/add', f);
				if (drawing) {
					this.$nextTick(() => {
						// after FLE is created
						const timeout = isMobile() ? 500 : 0;
						setTimeout(() => {
							this.$nuxt.$emit('selectAttempt', f);
						}, timeout);
					});
				}

				if (this.visitor) {
					f.set('visitorFeature', true);
					this.$emit('visitorFeatureAdded', f);
				} else {
					f.set('visitorFeature', false);
				}

				this.$nuxt.$emit('contentModified');
			});

			this.source.on('removefeature', (f) => {
				this.$store.commit('selected/remove', f.feature);
				this.$store.commit('features/remove', f.feature);

				if (this.visitor) {
					this.$emit('visitorFeatureRemoved', f.feature);
				}
				this.$nuxt.$emit('contentModified');
			});
		},
	},
};
*/
</script>

<template>
	<ol-map
		:controls="[]"
		:load-tiles-while-animating="true"
		:load-tiles-while-interacting="true"
		style="height: 100%"
	>
		<ol-view
			ref="viewRef"
			:center="initialCenter"
			max-zoom="19"
			:zoom="initialZoom"
			:projection="PARTIMAP_PROJECTION"
			@change:resolution="updateCurrentZoom"
		/>

		<BaseMaps />

		<ol-vector-layer>
			<ol-source-vector ref="sourceRef">
				<ol-feature
					v-for="f in visibleFeatures"
					:key="f.id"
				>
					<MapFeature
						:f="f"
						:gray-rated="grayRated"
						:label-override="(labelOverrides || {})[Number(f.id)] || ''"
						:visitor="visitor"
					/>
				</ol-feature>
			</ol-source-vector>
		</ol-vector-layer>

		<MapControls />
	</ol-map>
</template>
