
<template>
	<b-card class="feature-list-container">
		<template
			v-if="!visitor"
			#header
		>
			<div class="add-feature">
				<b-button-group class="w-100">
					<b-button
						:class="{ 'btn-success': !editState, 'btn-danger': editState}"
						@click="changeDrawType()"
					>
						<span
							v-if="!editState"
							class="material-icons d-flex justify-content-center"
						>
							add
						</span>
						<span
							v-if="editState"
							class="material-icons d-flex justify-content-center"
						>
							close
						</span>
					</b-button>
					<b-dropdown
						right
						:text="translateDrawType"
						class="w-75 add-feature-selector"
						variant="white"
						:disabled="editState"
					>
						<b-dropdown-item @click="selectedDrawType = 'Point'">Pont</b-dropdown-item>
						<b-dropdown-item @click="selectedDrawType = 'LineString'">Útvonal</b-dropdown-item>
						<b-dropdown-item @click="selectedDrawType = 'Polygon'">Terület</b-dropdown-item>
					</b-dropdown>
				</b-button-group>
			</div>
		</template>
		<b-card-body class="p-0 m-0">
			<div class="mb-3 mx-auto pt-1 w-75">
				<b-input-group>
					<b-input
						v-model="search"
						placeholder="Keresés..."
						size="sm"
					/>
					<b-input-group-append>
						<b-button
							size="sm"
							variant="outline-secondary"
							@click="search=''"
						>
							<i class="fas fa-backspace" />
						</b-button>
					</b-input-group-append>
				</b-input-group>
			</div>
			<b-list-group>
				<FeatureListElement
					v-for="feature in allFeatures"
					:key="feature.getId()"
					:feature="feature"
					:visitor="visitor"
				/>
			</b-list-group>
			<div class="sidebar-button sidebar-collapse">
				<a
					v-b-toggle.map-sidebar
					href="#"
				>
					<svg
						width="14"
						height="150"
					>
						<path
							d=" M 0 150 L 13 135 L 13 15 L 0 0"
							fill="rgb(247,247,247)"
							stroke="rgb(223,223,223)"
						/>
						<path d="M 0 0 L 0 150" />
					</svg>
				</a>
				<span class="material-icons collapse-icon">
					expand_less
				</span>
			</div>
		</b-card-body>
		<template
			v-if="!visitor"
			#footer
		>
			<div class="buttons">
				<b-button variant="warning p-0 mb-1">
					<div class="content d-flex">
						<div class="material-icons d-inline  border-info py-1 pl-1">
							file_upload
						</div>
						<div class="text d-inline p-1 pr-2">
							Import
						</div>
					</div>
				</b-button>
				<b-button variant="warning p-0 mb-1">
					<div class="content d-flex">
						<div class="material-icons d-inline  border-info py-1 pl-1">
							file_download
						</div>
						<div class="text d-inline p-1 pr-2">
							Export
						</div>
					</div>
				</b-button>
			</div>
		</template>
	</b-card>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	props: {
		visitor: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			selectedDrawType: 'Point',
			containerVisible: true,
			search: '',
		};
	},
	computed: {
		...mapGetters({
			getAllFeatures: 'features/getAllFeature',
			getSelectedFeature: 'selected/getSelectedFeature',
		}),
		allFeatures() {
			return this.getAllFeatures.filter(
				f =>
					String(f.getId() || '')
						.toLowerCase()
						.includes(this.search.toLowerCase()) ||
					(f.get('name') || '')
						.toLowerCase()
						.includes(this.search.toLowerCase())
			);
		},
		editState() {
			return this.$store.getters.getEditState;
		},
		translateDrawType() {
			switch (this.selectedDrawType) {
			case 'Point':
				return 'Pont';
			case 'LineString':
				return 'Útvonal';
			case 'Polygon':
				return 'Terület';
			default:
				return null;
			}
		},
	},
	watch: {
		editState(state) {
			if (!state) {
				this.$nuxt.$emit('drawType', '');
			}
		},
		getSelectedFeature(f) {
			if (f) {
				const id = f.getId();
				const ids = this.allFeatures.map(f => f.getId());
				console.log('Selected feature: ', id);
				console.log('Result IDs: ', ids);
				if (!ids.includes(id)) {
					// selected feature doesn't match current search filter
					// it means that click was on the map, we must show the
					// feature to the user -> we should reset search filter
					this.search = '';
				}
			}
		},
	},
	methods: {
		changeDrawType() {
			this.$nuxt.$emit('drawType', this.editState ? '' : this.selectedDrawType);
			this.$store.commit('toggleEditState', !this.editState);
			this.$store.commit('selected/change', null);
		},
	},
};
</script>

<style scoped>
.card-body {
	overflow: auto;
	padding: 1rem;
}
.card-footer {
	padding: 1rem;
}
.card {
	height: 100%;
}

.add-feature-selector {
	background-color: #fff;
	border: 1px solid rgba(0, 0, 0, 0.125);
	border-radius: 0.25rem;
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
}
</style>
