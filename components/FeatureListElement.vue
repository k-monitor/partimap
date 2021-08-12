<template>
	<div>
		<b-list-group-item
			button
			:class="{ selected: isActive }"
			class="mt-1 rounded"
			@click="selectFeature(feature)"
		>
			{{ `${feature.getGeometry().getType()} UUID: ${feature.ol_uid}` }}
			<div class="icons">
				<span class="material-icons" @click.stop="doSomething"> edit </span>
				<span class="material-icons" @click.stop="$nuxt.$emit('clearFeatures',{feature})"> delete </span>
			</div>
		</b-list-group-item>
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
</style>
