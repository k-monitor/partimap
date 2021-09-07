
<template>
	<div>
		<b-collapse id="feature-list" v-model="containerVisible">
			<b-card class="real">
				<template #header>
					<div class="add-feature">
						<b-button-group class="w-100 ">
							<b-button
								:class="{ 'btn-success': !editState, 'btn-danger': editState}"
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
					<div class="accordion" role="tablist">
						<div class="overflow-auto">
							<b-card-text>
								<b-list-group>
									<FeatureListElement
										v-for="feature in allFeatures"
										:key="feature.getId()"
										:feature="feature"
									/>
								</b-list-group>
							</b-card-text>
						</div>
					</div>
				</b-card-body>
				<template #footer>
					<div class="buttons mb-3">
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
					<button
						v-b-toggle.feature-list
						class="d-block w-100 p-0 collapse-button position-absolute"
					>
						<span class="material-icons icon-collapse">
							expand_less
						</span>
					</button>
				</template>
			</b-card>
		</b-collapse>
		<b-card
			v-if="!containerVisible"
			style="height: 20px;"
		>
			<button
				v-b-toggle.feature-list
				class="d-block w-100 p-0 collapse-button position-absolute"
			>
				<span class="material-icons icon-collapse">
					expand_more
				</span>
			</button>
		</b-card>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			selectedDrawType: 'Point',
			containerVisible: true
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
		translateDrawType() {
			switch (this.selectedDrawType) {
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
	watch: {
		editState(state) {
			if (!state) {
				this.$nuxt.$emit('drawType', '');
			}
		},
	},
	methods: {
		changeDrawType() {
			this.$nuxt.$emit('drawType', this.editState ? '' : this.selectedDrawType);
			this.$store.commit('toggleEditState', !this.editState);
			this.$store.commit('selected/change', null);
		}
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
.card.real {
    position: relative;
    height: 85vh;
}

.add-feature-selector {
	background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.125);
	border-radius: 0.25rem;
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
}

.material-icons.icon-collapse{
	font-size: 20px;
}

.collapse-button{
	height: 18px;
	bottom: 0;
	left: 0;
	border:none;
	border-radius: 0 0 0.25rem 0.25rem;
	background-color: rgba(0, 0, 0, 0.1)
}
.collapse-button:hover{
		background-color: rgba(0, 0, 0, 0.2)
}
.collapse-button:active{
			background-color: rgba(0, 0, 0, 0.3)

}
</style>
