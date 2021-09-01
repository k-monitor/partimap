
<template>
	<b-card>
		<div class="add-feature">
			<b-button-group class="w-100 ">
				<b-button variant="success" @click="changeDrawType()">
					<span class="material-icons d-flex justify-content-center">
						add
					</span>
				</b-button>
				<b-dropdown
					right
					:text="translateDrawType"
					class="w-75 add-feature-selector"
					variant="white"
				>
					<b-dropdown-item @click="selectedDrawType = 'Point'">Pont</b-dropdown-item>
					<b-dropdown-item @click="selectedDrawType = 'LineString'">Útvonal</b-dropdown-item>
					<b-dropdown-item @click="selectedDrawType = 'Polygon'">Terület</b-dropdown-item>
				</b-dropdown>
			</b-button-group>
		</div>
		<hr>
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
	</b-card>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			selectedDrawType: 'Point'
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
			this.$nuxt.$emit('drawType', this.selectedDrawType);

			this.$store.commit('toggleEditState', true);
			this.$store.commit('selected/change', null);
		}
	}
};

</script>

<style scoped>
.card-body {
    overflow: auto;
	padding: 1rem;
}

.card {
    position: relative;
    max-height: 75vh;
}

.add-feature-selector {
	background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.125);
	border-radius: 0.25rem;
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
}

</style>
