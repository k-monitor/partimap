
<template>
	<b-card class="feature-list-container">
		<template v-if="!visitor || availableVisitorDrawingInteractions" #header>
			<div class="add-feature">
				<b-button-group class="w-100 ">
					<b-button
						:class="{ 'btn-success': !editState, 'btn-danger': editState}"
						:disabled="!selectedDrawType"
						@click="changeDrawType()"
					>
						<span v-if="!editState" class="material-icons d-flex justify-content-center">
							add
						</span>
						<span v-if="editState" class="material-icons d-flex justify-content-center">
							close
						</span>
					</b-button>
					<b-dropdown
						right
						:text="selectedDrawType ? translateDrawType(selectedDrawType) : 'Válasszon'"
						class="w-75 add-feature-selector"
						variant="white"
						:disabled="editState"
					>
						<b-dropdown-item
							v-for="interaction in drawingInteractions"
							:key="interaction"
							@click="selectedDrawType = interaction"
						>
							{{ translateDrawType(interaction) }}
						</b-dropdown-item>
					</b-dropdown>
				</b-button-group>
			</div>
			<div v-if="!visitor && availableVisitorDrawingInteractions" class="visitor-interactions pt-2">
				<b-card>
					<template #header>
						Látogatói interakciók:
					</template>
					<b-form-group v-slot="{ ariaDescribedby }" class="m-0">
						<b-form-checkbox-group
							v-model="visitorDrawingInteractions"
							class="w-100"
							:options="visitorDrawingInteractionOptions"
							:aria-describedby="ariaDescribedby"
							button-variant="outline-success"
							size="sm"
							buttons
						/>
					</b-form-group>
				</b-card>
			</div>
		</template>
		<b-card-body class="p-0 m-0">
			<b-list-group>
				<FeatureListElement
					v-for="feature in allFeatures"
					:key="feature.getId()"
					:feature="feature"
					:visitor="visitor"
				/>
			</b-list-group>
			<div class="sidebar-button sidebar-collapse">
				<a v-b-toggle.map-sidebar href="#">
					<svg width="14" height="150">
						<path
							d=" M 0 150 L 13 135 L 13 15 L 0 0"
							fill="rgb(247,247,247)"
							stroke="rgb(223,223,223)"
						/>
						<path
							d="M 0 0 L 0 150"
						/>
					</svg>
				</a>
				<span class="material-icons collapse-icon">
					expand_less
				</span>
			</div>
		</b-card-body>
		<template v-if="!visitor" #footer>
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
			default: false
		},
		availableVisitorDrawingInteractions: {}

	},
	data() {
		return {
			selectedDrawType: null,
			containerVisible: true,
			visitorDrawingInteractionOptions: [
				{ text: 'Pont', value: 'Point' },
				{ text: 'Útvonal', value: 'LineString' },
				{ text: 'Terület', value: 'Polygon' }
			],
			visitorDrawingInteractions:
				this.availableVisitorDrawingInteractions
					? JSON.parse(this.availableVisitorDrawingInteractions)
					: null
		};
	},
	computed: {
		...mapGetters({ getAllFeatures: 'features/getAllFeature' }),
		allFeatures() {
			return this.getAllFeatures;
		},
		editState() {
			return this.$store.getters.getEditState;
		},
		drawingInteractions() {
			if (!this.visitor) {
				const interactions = ['Point', 'LineString', 'Polygon'];
				return interactions;
			} else {
				return JSON.parse(this.availableVisitorDrawingInteractions);
			}
		}
	},
	watch: {
		editState(state) {
			if (!state) {
				this.$nuxt.$emit('drawType', '');
			}
		},
		visitorDrawingInteractions(interactions) {
			this.$emit('addVisitorDrawingInteractions', interactions);
		}
	},
	methods: {
		changeDrawType() {
			this.$nuxt.$emit('drawType', this.editState ? '' : this.selectedDrawType);
			this.$store.commit('toggleEditState', !this.editState);
			this.$store.commit('selected/change', null);
		},
		translateDrawType(drawType) {
			switch (drawType) {
			case 'Point':
				return ('Pont');
			case 'LineString':
				return ('Útvonal');
			case 'Polygon':
				return ('Terület');
			default:
				return (null);
			}
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

.visitor-interactions .card-header {
	padding: 0.2em 1em;
}

.visitor-interactions .card-body {
	padding: 0.5em 1em;
}
@media screen and (max-width: 600px) {
	.visitor-interactions .card-body {
	padding: 0.5em 0em;
	}
}
</style>
