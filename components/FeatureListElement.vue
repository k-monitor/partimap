<template>
	<div>
		<b-list-group-item
			ref="feature"
			button
			:class="[{ selected: selectedFeature, disabled: onEditMode }]"
			class="mt-1 rounded"
			@click="featureClicked()"
		>
			<span class="text-break">{{ form.name }}</span>
			<span v-if="!visitor" class="material-icons m-0 float-right text-danger" @click.stop="showConfirmModal"> delete </span>
		</b-list-group-item>
		<b-collapse :id="`collapse-${feature.getId()}`" :visible="selectedFeature" accordion="my-accordion" @shown="expandFinished()">
			<b-card class="collapse-content">
				<b-form v-if="selectedFeature" @submit.prevent="">
					<div v-if="!visitor">
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
					</div>
					<div v-else>
						<b-row align-h="between" align-v="start" class="mt-1">
							<b-col>
								<label class="mb-md-0" for="type-text">Értékelés: </label>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<b-form-rating v-model="rating" variant="warning" />
							</b-col>
						</b-row>
					</div>
					<b-row align-h="between" align-v="start" class="mt-1">
						<b-col>
							<label class="mb-md-0" for="type-text">Név: </label>
						</b-col>
					</b-row>
					<b-row>
						<b-col>
							<b-form-input
								id="type-text"
								v-model="form.name"
								size="sm"
								type="text"
								:readonly="visitor"
							/>
						</b-col>
					</b-row>
					<b-row class="mt-1 pb-3">
						<b-col>
							<b-textarea
								id=""
								v-model="form.description"
								name="form-description"
								cols="30"
								rows="5"
								class="w-100"
								size="sm"
								placeholder="Leírás"
								maxlength="1000"
								:readonly="visitor"
							/>
							<span v-if="!visitor" class="badge badge-secondary char-count">{{ descriptionLength }} / 1000</span>
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
		visitor: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			form: {
				name: this.getFeatureName(),
				color: this.feature.get('color'),
				description: this.feature.get('description'),
			},
			rating: null
		};
	},
	computed: {
		...mapGetters({ getSelectedFeature: 'selected/getSelectedFeature' }),
		selectedFeature() {
			return (this.getSelectedFeature === this.feature);
		},
		onEditMode() {
			return this.$store.getters.getEditState;
		},
		descriptionLength() {
			return this.form.description ? this.form.description.length : 0;
		}
	},
	watch: {
		'form.color' () {
			this.$nuxt.$emit('changeStyle', this.feature, this.form.color);
			// debounce maybe..
		},
		'form.name' () {
			this.feature.set('name', this.form.name);
		},
		'form.description' () {
			this.feature.set('description', this.form.description);
		},
		form: {
			handler(val) {
				this.$nuxt.$emit('contentModified');
				console.log(val);
			},
			deep: true
		}
	},
	mounted() {
		// When an element is created, scroll to it
		this.$refs.feature.scrollIntoView({ behavior: 'smooth' });
	},
	methods: {
		getFeatureName() {
			const idStr = this.feature.getId().toString();
			return this.feature.get('name') || idStr.substring(idStr.length - 5);
		},
		featureClicked() {
			this.selectedFeature
				? this.$store.commit('selected/remove', this.feature)
				: this.$store.commit('selected/change', this.feature);
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
				centered: true,
				autoFocusButton: 'ok'
			})
				.then(value => {
					if (value) {
						this.$nuxt.$emit('clearFeature', this.feature);
					}
				})
				.catch(err => {
					console.warn(err.message);
					this.error('Sikertelen törlés.');
				});
		},
		expandFinished() {
			this.$refs.feature.scrollIntoView({ behavior: 'smooth' });
		}
	}

};
</script>
<style scoped>
.list-group-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.5rem 1rem;
}
.selected {
	border-left: 4px solid #00ce89;
}
.material-icons {
  font-size: 24px;
  margin-left: 10px;
  cursor: pointer;
  opacity: 0.5;
}
.material-icons:hover {
  opacity: 1;
}

.collapse-content {
	border-top: none;
	border-radius: 0 0 0.25rem 0.25rem;
}
.card-body {
	padding: 1rem;
}

.char-count {
	position: absolute;
	margin-top: 2px;
	font-size: 60%;
}

</style>
