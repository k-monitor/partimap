<template>
	<div class="wrapper">
		<client-only placeholder="Loading...">
			<Map
				:initial-center="[2129152.791287463,6017729.508627875]"
				:initial-zoom="10"
				:features="featuresFromRaw(featuresRaw)"
				:visitor="visitor"
			/>
		</client-only>
		<div class="feature-sidebar">
			<b-sidebar id="map-sidebar" v-model="mapSidebarShown" right no-header>
				<slot name="feature-editor" />
			</b-sidebar>
			<div class="sidebar-button sidebar-expand">
				<a v-b-toggle.map-sidebar href="#">
					<svg width="13" height="150">
						<path
							d=" M 13 150 L 0 135 L 0 15 L 13 0"
							fill="rgb(247,247,247)"
							stroke="rgb(223,223,223)"
						/>
						<path
							d="M 13 0 L 13 150"
						/>
					</svg>
				</a>
				<span class="material-icons collapse-icon">
					expand_more
				</span>
			</div>
		</div>
	</div>
</template>

<script>
import GeoJSON from 'ol/format/GeoJSON';
import { mapGetters } from 'vuex';

export default {
	components: {
		Map: () => process.client ? import('@/components/Map') : null,
	},
	props: {
		featuresRaw: {},
		visitor: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			mapSidebarShown: !this.visitor
		};
	},
	computed: {
		...mapGetters({ getSelectedFeature: 'selected/getSelectedFeature' }),
	},
	watch: {
		// newFeature is null, if no feature is selected
		getSelectedFeature(selectedFeature) {
			if (this.visitor) {
				selectedFeature ? this.mapSidebarShown = true : this.mapSidebarShown = false;
			}
		}
	},
	methods: {
		featuresFromRaw(featuresRaw) {
			const featuresJSON = JSON.parse(featuresRaw);
			const geoJSONify = featuresJSON => {
				return { type: 'FeatureCollection', features: featuresJSON };
			};

			if (!featuresJSON) {
				return null;
			}
			const features = new GeoJSON().readFeatures(geoJSONify(featuresJSON));
			return features;
		},
	}
};
</script>

<style>
#map-sidebar {
	top: 120px;
	bottom: 50px;
	height: auto;
	width: 270px;
	border-radius: 0.25rem;
}

@media screen and (max-width: 600px) {
	#map-sidebar {
		width: 220px;
	}
}
.sidebar-button {
	position: absolute;
	top: 50%;
}
.sidebar-button.sidebar-collapse {
	transform: translate(0, -50%);

}
.feature-sidebar .sidebar-button.sidebar-collapse {
	left: 0;
}
.sidebar-button:hover path{
	fill: rgb(223, 223, 223);
}
.sidebar-button .collapse-icon {
	position: absolute;
	font-size: 15px;
	font-weight: 700;
	top: 50%;
	transform: translate(-15px, -50%) rotate(90deg);
	pointer-events: none;

}
.feature-sidebar .sidebar-button.sidebar-expand {
	right: 0;
	transform: translate(0, -50%) translateY(35px);
}

</style>
