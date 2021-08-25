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
					<span>{{ `${featureName}` }}</span>
				</b-col>
				<b-col align-self="center" cols="4" sm>
					<div class="icons">
						<span class="material-icons m-0" @click.stop="showConfirmModal"> delete </span>
					</div>
				</b-col>
			</b-row>
		</b-list-group-item>
		<b-collapse :id="`collapse-${feature.getId()}`" v-model="selectedFeature" accordion="my-accordion">
			<b-card class="collapse-content">
				<b-form v-if="selectedFeature" @submit="modifyFeature">
					<b-row align-h="between" align-v="center">
						<b-col md="6">
							<label class="mb-md-0" for="type-color">Szín: </label>
						</b-col>
						<b-col md="6">
							<b-form-input
								id="type-color"
								v-model="form.color"
								size="sm"
								type="color"
							/>
						</b-col>
					</b-row>
					<b-row align-h="between" align-v="start" class="mt-1">
						<b-col>
							<label class="mb-md-0" for="type-text">Név: </label>
						</b-col>
					</b-row>
					<b-row align-h="between" align-v="center" class="text-center">
						<b-col>
							<b-form-input
								id="type-text"
								v-model="form.name"
								size="sm"
								type="text"
								:placeholder="featureName"
							/>
						</b-col>
					</b-row>
					<b-row class="mt-2">
						<b-col>
							<b-button type="submit" size="sm" variant="success" class="float-right"> Alkalmaz </b-button>
						</b-col>
					</b-row>
				</b-form>
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
			featureName: `UUID: ...${this.getFeatureName()}`,
			form: {
				name: this.featureName,
				color: this.test()
			},
			delConfirmModalOn: false,
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
		},
	},
	methods: {
		modifyFeature(event) {
			event.preventDefault();
			this.selectedFeature = false;
			this.featureName = this.form.name || this.featureName;
			this.form.name = '';
			this.$nuxt.$emit('changeStyle', this.feature, this.form.color);
		},
		getFeatureName() {
			const idStr = this.feature.getId().toString();
			return idStr.substring(idStr.length - 5);
		},
		featureClicked() {
			this.getSelectedFeature === this.feature
				? this.$store.commit('selected/remove', this.feature)
				: this.$store.commit('selected/change', this.feature);
		},
		applyChanges() {
			this.selectedFeature = false;
			this.$nuxt.$emit('changeStyle', this.feature, this.color);
		},
		showConfirmModal() {
			this.$bvModal.msgBoxConfirm('Biztosan törli a kiválasztott elemet?', {
				title: 'Megerősítés',
				size: 'sm',
				buttonSize: 'sm',
				okVariant: 'danger',
				okTitle: 'IGEN',
				cancelTitle: 'MÉGSEM',
				footerClass: 'p-2',
				hideHeaderClose: false,
				centered: true
			})
				.then(value => {
					if (value) {
						this.$nuxt.$emit('clearFeature', this.feature);
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		test() {
			return this.feature.get('color');
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

// "$nuxt.$emit('clearFeature',feature)"
