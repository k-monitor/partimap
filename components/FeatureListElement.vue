<template>
	<b-list-group-item
		button
		:class="{ active: isActive }"
		@click="selectFeature(feature)"
	>
		{{ `${feature.getGeometry().getType()} UUID: ${feature.ol_uid}` }}
	</b-list-group-item>
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
			isActive: false
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

</style>
