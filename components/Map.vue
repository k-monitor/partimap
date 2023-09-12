/* Use only inside
<client-only> </client-only>
tags! */

<template>
	<div>
		<div
			ref="map-root"
			class="h-100 position-absolute w-100 map"
		/>
		<div class="map-zoom-toolbar">
			<b-button-group
				class="shadow-sm"
				vertical
			>
				<b-button
					v-b-tooltip.hover.left
					class="border border-secondary py-2"
					variant="dark"
					:title="$t('Map.changeBaseMap')"
					@click="changeBaseMap()"
				>
					<i class="fas fa-map" />
				</b-button>
				<b-button
					class="border border-secondary py-2"
					variant="dark"
					@click="changeZoom(1)"
				>
					<i class="fas fa-fw fa-plus" />
				</b-button>
				<b-button
					class="border border-secondary py-2"
					variant="dark"
					@click="changeZoom(-1)"
				>
					<i class="fas fa-fw fa-minus" />
				</b-button>
			</b-button-group>
		</div>
	</div>
</template>

<script>
import tinycolor from 'tinycolor2';
import wordWrap from 'word-wrap';
import { mapGetters, mapMutations } from 'vuex';
import Collection from 'ol/Collection';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import { Attribution, defaults as defaultControls } from 'ol/control';
import { Draw, Snap } from 'ol/interaction';
import { Vector as VectorLayer } from 'ol/layer';
import { get } from 'ol/proj/transforms';
import { Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import createBaseMaps from '@/assets/basemaps';
import { isMobile } from '@/assets/constants';
import 'ol/ol.css';

const gm2ol = get('EPSG:4326', 'EPSG:3857');

export default {
	props: {
		features: {
			type: Array,
			default: null,
			validator: container => container.every(f => f instanceof Feature),
		},
		fitSelected: {
			type: Boolean,
			default: false,
		},
		grayRated: {
			type: Boolean,
			default: false,
		},
		initialBaseMapKey: {
			type: String,
			default: '',
		},
		labels: {
			type: Object,
			default: () => {},
		},
		visitor: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			// ol/Map object
			map: null,
			baseMaps: createBaseMaps(),
			baseMapKey: this.initialBaseMapKey,

			// default color for drawn features
			defaultColor: {
				drawing: '#607D8B',
				Point: '#F44336',
				LineString: '#3F51B5',
				Polygon: '#4CAF50',
			},
			defaultStroke: {
				lineDash: '0',
				width: 6,
			},
			filteredIds: null, // null means no filter, otherwise it's an ID array
		};
	},
	computed: {
		...mapGetters(['getBaseMap']),
		...mapGetters({ drawType: 'getDrawType' }), // if truthy, a feature is currently drawn
		...mapGetters({ getSelectedFeature: 'selected/getSelectedFeature' }),
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
		getBaseMap() {
			this.updateLayers();
		},
		/**
		 * @param selFeature Is null if the map is clicked
		 * without clicking on a feature.
		 */
		getSelectedFeature(selFeature) {
			if (!selFeature) {
				this.removeBlur();
			} else {
				this.source.getFeatures().forEach(feature => {
					this.updateFeatureStyle(feature, selFeature);
				});
			}

			this.fitViewToFeatures();
		},
		labels: {
			handler() {
				this.updateAllFeatures();
			},
			deep: true,
		},
	},
	mounted() {
		this.$store.commit('selected/clear');
		this.initMapComponents();
		this.fitViewToFeatures();
		this.addEventListeners();
	},
	created() {
		// handles feature deletion, performed in the feature-sidebar
		this.$nuxt.$on('clearFeature', feature => {
			this.vector.getSource().removeFeature(feature);
		});
		this.$nuxt.$on('clearFeatures', ids => {
			this.vector
				.getSource()
				.getFeatures()
				.filter(f => ids.includes(f.getId()))
				.forEach(f => this.vector.getSource().removeFeature(f));
		});
		// handles feature style change, performed in the feature-sidebar
		this.$nuxt.$on('changeStyle', (feature, color, dash, width) => {
			this.changeFeatureStyle(feature, color, dash, width, true);
		});

		this.$nuxt.$on('importedFeatures', features => {
			this.$store.commit('selected/clear');
			// TODO would be nice to remove/overwrite already existing feature by ID
			features.forEach(f => this.vector.getSource().addFeature(f));
			this.fitViewToFeatures();
		});

		this.$nuxt.$on('filterFeatures', ids => {
			this.filteredIds = ids;
			this.updateAllFeatures();
		});
	},
	beforeDestroy() {
		this.$nuxt.$off('clearFeature');
		this.$nuxt.$off('clearFeatures');
		this.$nuxt.$off('changeStyle');
		this.$nuxt.$off('importedFeatures');
		this.$nuxt.$off('filterFeatures');
	},
	methods: {
		...mapMutations(['setBaseMap']),
		changeBaseMap() {
			const keys = Object.keys(this.baseMaps);
			const index = (keys.indexOf(this.getBaseMap) + 1) % keys.length;
			this.setBaseMap(keys[index]);
			// watcher will call updateLayers
		},
		updateLayers() {
			const key = this.baseMaps[this.getBaseMap]
				? this.getBaseMap
				: 'osm';
			Object.keys(this.baseMaps).forEach(k => {
				this.baseMaps[k].forEach(l => l.setVisible(k === key));
			});
		},
		changeZoom(delta) {
			const view = this.map.getView();
			const newZoom = view.getZoom() + delta;
			view.animate({
				duration: 200,
				zoom: newZoom,
			});
		},
		initMapComponents() {
			if (this.initialBaseMapKey) {
				this.setBaseMap(this.initialBaseMapKey);
			}

			// localized map init
			const coords = this.$t('Map.initialCenter').split(',');
			const center = gm2ol(coords.reverse());
			const zoom = Number(this.$t('Map.initialZoom')) || 10;

			this.view = new View({
				center,
				constrainResolution: true,
				maxZoom: 19,
				zoom,
			});
			this.view.on('change:resolution', () => {
				this.updateAllFeatures();
			});

			this.source = new VectorSource({
				features: this.loadInitFeatures(this.features),
			});

			this.vector = new VectorLayer({
				source: this.source,
			});

			this.map = new Map({
				controls: defaultControls({ attribution: false }).extend([
					new Attribution({ collapsible: false }),
				]),
				layers: [...Object.values(this.baseMaps).flat(), this.vector],
				target: this.$refs['map-root'],
				view: this.view,
			});
			this.updateLayers();
		},
		fitViewToFeatures() {
			// no need to fit view if no feature is present
			if (!this.source.getFeatures().length) {
				return;
			}

			// fit to selected feature or all features
			const extent =
				this.getSelectedFeature && this.fitSelected
					? this.getSelectedFeature.getGeometry().getExtent()
					: this.source.getExtent();

			const leftPadding = isMobile() ? 0 : 400;

			this.map.getView().fit(extent, {
				duration: 200,
				padding: [0, 0, 0, leftPadding],
			});
		},
		addEventListeners() {
			this.map.on('click', e => {
				if (this.drawType) return;
				const clickedFeature = this.map
					.getFeaturesAtPixel(e.pixel)
					.find(f => !f.get('hidden'));
				this.$nuxt.$emit('selectAttempt', clickedFeature); // feature or null
			});

			this.map.on('pointermove', e => {
				const hit = this.map
					.getFeaturesAtPixel(e.pixel)
					.find(f => !f.get('hidden'));
				this.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
			});

			this.source.on('addfeature', e => {
				const f = e.feature;
				if (!f.getId()) {
					f.setId(new Date().getTime());
				}

				const drawing = !!this.drawType; // otherwise importing
				if (drawing) {
					// drawn feature
					this.changeFeatureStyle(
						f,
						this.defaultColor[this.drawType] ||
							this.defaultColor.drawing,
						this.defaultStroke.lineDash,
						this.defaultStroke.width,
						true
					);
				} else {
					// imported feature
					this.changeFeatureStyle(
						f,
						f.get('color') || this.defaultColor.drawing,
						f.get('dash') || this.defaultStroke.lineDash,
						f.get('width') || this.defaultStroke.width,
						false
					);
				}

				this.$store.commit('setDrawType', '');
				this.$store.commit('features/add', f);
				if (drawing) {
					this.$nextTick(() => {
						// after FLE is created
						this.$nuxt.$emit('selectAttempt', f);
					});
					// this.$store.commit('selected/change', f);
				}

				if (this.visitor) {
					f.set('visitorFeature', true);
					this.$emit('visitorFeatureAdded', f);
				} else {
					f.set('visitorFeature', false);
				}

				this.$nuxt.$emit('contentModified');
			});

			this.source.on('removefeature', f => {
				if (f.feature === this.getSelectedFeature) {
					this.removeBlur();
				}
				this.$store.commit('selected/remove', f.feature);
				this.$store.commit('features/remove', f.feature);

				if (this.visitor) {
					this.$emit('visitorFeatureRemoved', f.feature);
				}
				this.$nuxt.$emit('contentModified');
			});
		},
		loadInitFeatures(features) {
			// flush the store before initialization
			this.$store.commit('features/clear');
			if (!features) {
				return null;
			}
			for (const f of features) {
				this.$store.commit('features/add', f);
				this.changeFeatureStyle(
					f,
					f.get('color'),
					f.get('dash'),
					f.get('width'),
					false
				); // apply stored style
			}
			return new Collection(features);
		},
		changeFeatureStyle(feature, color, lineDash, strokeWidth, select) {
			feature.set('color', color);
			feature.set('dash', lineDash);
			feature.set('width', strokeWidth);
			this.updateFeatureStyle(feature, select ? feature : null);
		},
		removeBlur(feature = null) {
			if (feature) {
				this.updateFeatureStyle(feature);
			} else {
				this.source.getFeatures().forEach(feature => {
					this.updateFeatureStyle(feature);
				});
			}
		},
		updateAllFeatures() {
			this.source.getFeatures().forEach(feature => {
				this.updateFeatureStyle(feature, this.getSelectedFeature);
			});
		},
		updateFeatureStyle(feature, selFeature) {
			const r = feature.get('rating');
			const rated = Number.isInteger(r) && r !== 0;
			const color =
				rated && this.grayRated ? '#666666' : feature.get('color');

			// lower opacity of unselected features
			const isUnselected =
				selFeature && selFeature.getId() !== feature.getId();
			const opacity = isUnselected ? '60' : '';

			// raise width of selected features
			const isHidden = feature.get('hidden');
			const isPoint = feature.getGeometry().getType() === 'Point';
			const isSelected =
				selFeature && selFeature.getId() === feature.getId();
			const addWidth =
				isSelected && !isHidden && !isPoint && this.visitor ? 5 : 0;

			// decrease width with zoom
			const zoom = this.view.getZoom();
			const decWidth = 19 - zoom;

			const newWidth = Math.max(
				2,
				Number(feature.get('width')) + addWidth - 0.75 * decWidth
			);

			// if item is filtered out, hide it
			if (
				this.filteredIds !== null &&
				!this.filteredIds.includes(feature.getId())
			) {
				return feature.setStyle(() => false);
			}

			const pointFillColor = color + opacity;
			const lineColor = color + opacity;
			const polygonColor = color;
			const lineDash = feature.get('dash');
			const strokeWidth = newWidth;

			const bgColor = pointFillColor || lineColor || polygonColor;
			const isBright = tinycolor(bgColor).isLight();
			const fgColor = isBright ? '#000000' : '#ffffff';

			let rotation = 0;
			let text = '';
			const fontSize = Math.max(10, strokeWidth * 3.5);
			if (Object.keys(this.labels || {}).length) {
				// we received map label overrides which are rating results,
				// in this mode we don't want to show any feature labels,
				// just the results for those that have one
				rotation = 0;
				text = this.labels[feature.id_] || '';
			} else {
				const angle = Number(feature.get('partimapMapLabelAngle') || 0);
				rotation = angle * (Math.PI / 180);
				text = feature.get('partimapMapLabel') || '';
			}
			text = wordWrap(text, {
				indent: '',
				trim: true,
				width: 25, // characters
			});

			// const selFeature = this.getSelectedFeature;
			// const isSelected = selFeature && selFeature.getId() === feature.id_;
			let zIndex = 0;
			if (isHidden) zIndex = -1;
			else if (isSelected) zIndex = 1;

			const style = new Style({
				geometry(feature) {
					return feature.getGeometry();
				},
				fill: polygonColor
					? new Fill({ color: polygonColor + '15' }) // more transparent fill
					: null,
				stroke: new Stroke({
					color: lineColor,
					lineCap: 'butt',
					lineDash: lineDash
						.split(',')
						.map(w => Number(w) * strokeWidth),
					width: strokeWidth,
				}),
				image: new CircleStyle({
					radius: strokeWidth * 3,
					fill: pointFillColor
						? new Fill({ color: pointFillColor })
						: null,
				}),
				text: new Text({
					font: `bold ${fontSize}px sans-serif`,
					text,
					placement: 'point',
					backgroundFill: new Fill({
						color: bgColor,
					}),
					fill: new Fill({
						color: fgColor,
					}),
					offsetY: 1,
					overflow: true,
					padding: [3, 3, 3, 3],
					rotation,
				}),
				zIndex,
			});

			feature.setStyle(style);
		},
	},
};
</script>

<style scoped>
.map-zoom-toolbar {
	position: absolute;
	right: 0;
	bottom: 2rem;
}

.btn {
	border-radius: 0.5rem;
	border-top-right-radius: 0px !important;
	border-bottom-right-radius: 0px !important;
	border-right-width: 0px !important;
	font-size: 1.25rem;
}
</style>

<style>
.ol-zoom {
	/* does not work in scoped style block */
	display: none;
}
</style>
