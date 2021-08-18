<template>
	<div>
		<b-list-group-item
			button
			:class="[{ selected: selectedFeature, disabled: onEditMode }, selectedFeature ? null : 'collapsed']"
			class="mt-1 rounded"
			@click="featureClicked()"
		>
			<b-row class="text-center" align-h="between">
				<b-col cols="8" sm>
					<span>{{ `${feature.getGeometry().getType()} UUID: ${feature.ol_uid}` }}</span>
				</b-col>
				<b-col align-self="center" cols="4" sm>
					<div class="icons">
						<span class="material-icons m-0" @click.stop="$nuxt.$emit('clearFeature',feature)"> delete </span>
					</div>
				</b-col>
			</b-row>
		</b-list-group-item>
		<b-collapse :id="`collapse-${feature.ol_uid}`" v-model="selectedFeature" accordion="my-accordion">
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
							<b-button variant="info" @click="applyChanges()">Alkalmaz</b-button>
						</b-col>
					</b-row>
				</b-container>
			</b-card>
		</b-collapse>
	</div>
</template>

<script>
import Feature from 'ol/Feature';
import { mapGetters } from 'vuex';
export default {
	props: {
		feature: {
			type: Feature,
			default: new Feature()
		},
	},
	data() {
		return {
			color: '#64C8FF', // ezt lehetne talán store-ból
			swatches: [
				'#27AF60',
				'#64C8FF',
				'#8E43AD',
				'#3D556E',
				'#F2C511'
			],
		};
	},
	computed: {
		...mapGetters({ getSelectedFeature: 'selected/getSelectedFeature' }),
		selectedFeature: {
			get() {
				return (this.getSelectedFeature === this.feature);
			},
			set(val) {
				val
					? this.$store.commit('selected/change', this.feature)
					: this.$store.commit('selected/remove', this.feature);
			}
		},
		onEditMode() {
			return this.$store.getters.getEditState;
		}
	},
	methods: {
		featureClicked() {
			this.getSelectedFeature === this.feature
				? this.$store.commit('selected/remove', this.feature)
				: this.$store.commit('selected/change', this.feature);
		},
		applyChanges() {
			this.selectedFeature = false;
			this.$nuxt.$emit('changeStyle', this.feature, this.color);
		}
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
