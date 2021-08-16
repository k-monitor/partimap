<template>
	<div>
		<b-list-group-item
			button
			:class="[{ selected: isActive }, isActive ? null : 'collapsed']"
			class="mt-1 rounded"
			@click="selectFeature(feature)"
		>
			<b-row class="text-center" align-h="between">
				<b-col cols="8" sm>
					<span>{{ `${feature.getGeometry().getType()} UUID: ${feature.ol_uid}` }}</span>
				</b-col>
				<b-col align-self="center" cols="4" sm>
					<div class="icons">
						<span class="material-icons m-0"> edit </span>
						<span class="material-icons m-0" @click.stop="$nuxt.$emit('clearFeature',feature)"> delete </span>
					</div>
				</b-col>
			</b-row>
		</b-list-group-item>
		<b-collapse :id="`collapse-${feature.ol_uid}`" v-model="isActive" accordion="my-accordion">
			<b-card class="collapse-content">
				<b-container>
					<b-row>
						<b-col cols="12">
							Válasszon színt:
						</b-col>
					</b-row>
					<b-row>
						<b-col cols="12">
							<v-swatches
								v-model="color"
								:swatches="swatches"
								swatch-size="20"
								inline
							/>
						</b-col>
					</b-row>
					<b-row>
						<b-col cols="12">
							<b-button variant="info" @click="selectFeature(feature)">Alkalmaz</b-button>
						</b-col>
					</b-row>
				</b-container>
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
			color: '#27AF60',
			swatches: [
				'#27AF60',
				'#2980B9',
				'#8E43AD',
				'#3D556E',
				'#F2C511'
			],
		};
	},
	watch: {
		color(val) {
			this.$nuxt.$emit('changeStyle', this.feature, val);
		}
	},
	created() {
		this.$nuxt.$on('selectionChanged', featureContainer => {
			if (featureContainer.array_.includes(this.feature)) {
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
	}

};
</script>

<style>
.list-group-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
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
