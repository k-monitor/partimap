<template>
	<div>
		<b-list-group-item
			button
			:class="[{ selected: isActive }, editVisible ? null : 'collapsed']"
			class="mt-1 rounded"
			@click="selectFeature(feature)"
		>
			{{ `${feature.getGeometry().getType()} UUID: ${feature.ol_uid}` }}
			<div class="icons">
				<span class="material-icons" @click.stop="editVisible = !editVisible"> edit </span>
				<span class="material-icons" @click.stop="$nuxt.$emit('clearFeatures',{feature})"> delete </span>
			</div>
		</b-list-group-item>
		<b-collapse :id="`collapse-${feature.ol_uid}`" v-model="editVisible" accordion="my-accordion">
			<b-card class="collapse-content">
				<!-- <b-button variant="info" @click="$nuxt.$emit('changeStyle',feature)">Szín Módosítása</b-button> -->
				<div class="d-flex justify-content-between">
					<div>
						<strong>Válasszon színt:</strong>
					</div>
					<div>
						<v-swatches
							v-model="color"
							:swatches="swatches"
							swatch-size="20"
							inline
						/>
					</div>
					<div>
						<b-button variant="info" @click="$nuxt.$emit('changeStyle',feature,color)">Alkalmaz</b-button>
					</div>
				</div>
			</b-card>
		</b-collapse>
	</div>
</template>

<script>
import Feature from 'ol/Feature';
export default {
	props: {
		feature: {
			type: Feature,
			default: new Feature()
		}
	},
	data() {
		return {
			isActive: false,
			editVisible: false,
			color: '#27AF60',
			swatches: [
				'#27AF60',
				'#2980B9',
				'#8E43AD',
				'#3D556E',
				'#F2C511'
			]
		};
	},
	created() {
		this.$nuxt.$on('selectionChanged', selectedFeatures => {
			if (this.feature.ol_uid in selectedFeatures) {
				this.isActive = true;
			} else {
				this.isActive = false;
			}
		});
	},
	methods: {
		selectFeature(feature) {
			this.$nuxt.$emit('featureClickedOnList', feature);
		},
	},

};
</script>

<style>
.list-group-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.icons {
	display: flex;
}
.selected {
	border-left: 4px solid #00ce89;
}
.material-icons {
  font-size: 24px;
  margin-left: 10px;
  color: #bbb;
  cursor: pointer;
}

.material-icons:hover {
  color: #777;
}

.collapse-content {
	border-top: none;
	border-radius: 0 0 0.25rem 0.25rem;
}
</style>
