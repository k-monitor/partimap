<template>
	<div>
		<b-list-group-item
			ref="feature"
			button
			:class="[{ selected: selectedFeature, disabled: onEditMode }]"
			class="mt-1 px-2 rounded"
			:style="{ borderLeftColor: form.color }"
			@click="featureClicked()"
		>
			<span class="text-break">{{ form.name }}</span>
			<span
				v-if="!visitor"
				class="material-icons m-0 float-right text-danger"
				@click.stop="showConfirmModal"
			>delete</span>
		</b-list-group-item>
		<b-collapse
			:id="`collapse-${feature.getId()}`"
			:visible="selectedFeature"
			accordion="my-accordion"
			@shown="expandFinished()"
		>
			<b-card class="collapse-content">
				<b-form
					v-if="selectedFeature"
					@submit.prevent=""
				>
					<div v-if="!visitor">
						<b-row
							align-h="between"
							align-v="center"
							class="mb-3"
						>
							<b-col>
								<label
									class="mb-md-0"
									for="type-color"
								>Szín: </label>
								<b-form-input
									id="type-color"
									v-model="form.color"
									size="sm"
									type="color"
									list="presetColors"
								/>
								<datalist id="presetColors">
									<option>#F44336</option>
									<option>#E91E63</option>
									<option>#9C27B0</option>
									<option>#673AB7</option>
									<option>#3F51B5</option>
									<option>#2196F3</option>
									<option>#03A9F4</option>
									<option>#00BCD4</option>
									<option>#009688</option>
									<option>#4CAF50</option>
									<option>#8BC34A</option>
									<option>#CDDC39</option>
									<option>#FFEB3B</option>
									<option>#ffc107</option>
									<option>#FF9800</option>
									<option>#FF5722</option>
									<option>#795548</option>
									<option>#9E9E9E</option>
									<option>#000000</option>
									<option>#607D8B</option>
								</datalist>
							</b-col>
							<b-col>
								<label
									class="mb-md-0"
									for="type-color"
								>Méret: </label>
								<b-form-input
									v-model="form.width"
									size="sm"
									type="number"
								/>
							</b-col>
						</b-row>
						<b-row
							v-if="feature.getGeometry().getType() !== 'Point'"
							align-h="between"
							align-v="center"
							class="mb-3"
						>
							<b-col md="3">
								<label
									class="mb-md-0"
									for="type-color"
								>Vonal: </label>
							</b-col>
							<b-col>
								<b-form-select
									v-model="form.dash"
									size="sm"
									:options="dashOptions"
								/>
							</b-col>
						</b-row>
						<b-row
							align-h="between"
							align-v="start"
						>
							<b-col>
								<label
									class="mb-md-0"
									for="type-text"
								>Név: </label>
							</b-col>
						</b-row>
						<b-row class="mb-3">
							<b-col>
								<b-form-input
									id="type-text"
									v-model="form.name"
									size="sm"
									type="text"
								/>
							</b-col>
						</b-row>
						<b-row
							align-h="between"
							align-v="start"
						>
							<b-col>
								<label
									class="mb-md-0"
									for="type-text"
								>Kategória:</label>
							</b-col>
						</b-row>
						<b-row class="mb-3">
							<b-col>
								<vue-typeahead-bootstrap
									v-model="form.category"
									placeholder="Kategória"
									size="sm"
									:data="categories"
									:min-matching-chars="0"
									:show-all-results="true"
									:show-on-focus="true"
								/>
							</b-col>
						</b-row>
						<b-row class="mb-3">
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
								/>
								<span
									v-if="!visitor"
									class="badge badge-secondary char-count"
								>{{ descriptionLength }} / 1000</span>
							</b-col>
						</b-row>
					</div>
					<div v-else>
						<p v-if="form.category">{{ form.category }}</p>
						<p v-if="form.description">{{ form.description }}</p>
						<b-row>
							<b-col>
								<b-form-rating
									v-model="rating"
									variant="warning"
								/>
							</b-col>
						</b-row>
					</div>
				</b-form>
			</b-card>
		</b-collapse>
	</div>
</template>

<script>
import Feature from 'ol/Feature';
import { mapGetters } from 'vuex';
import VueTypeaheadBootstrap from 'vue-typeahead-bootstrap';

export default {
	components: {
		VueTypeaheadBootstrap,
	},
	props: {
		categories: {
			type: Array,
			default: () => []
		},
		feature: {
			type: Feature,
			default: new Feature(),
		},
		visitor: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			form: {
				name: this.getFeatureName(),
				category: this.feature.get('category') || '', // empty string is important for typeahead comp
				color: this.feature.get('color'),
				dash: this.feature.get('dash'),
				description: this.feature.get('description'),
				width: this.feature.get('width'),
			},
			rating: null,
			dashOptions: [
				{ text: 'Folytonos', value: '0' },
				{ text: 'Pontozott', value: '1,1' },
				{ text: 'Szaggatott', value: '2,1' },
				{ text: 'Hosszan szagg.', value: '4,1' },
				{ text: 'Pont-vonal', value: '1,1,3,1' },
			],
		};
	},
	computed: {
		...mapGetters({ getSelectedFeature: 'selected/getSelectedFeature' }),
		selectedFeature() {
			return this.getSelectedFeature === this.feature;
		},
		onEditMode() {
			return this.$store.getters.getEditState;
		},
		descriptionLength() {
			return this.form.description ? this.form.description.length : 0;
		},
	},
	watch: {
		'form.category'() {
			this.feature.set('category', this.form.category);
			this.$emit('categoryEdited');
		},
		'form.color'() {
			this.emitChangeStyle();
			// debounce maybe..
		},
		'form.dash'() {
			this.emitChangeStyle();
		},
		'form.name'() {
			this.feature.set('name', this.form.name);
		},
		'form.description'() {
			this.feature.set('description', this.form.description);
		},
		'form.width'() {
			this.emitChangeStyle();
		},
		form: {
			handler(val) {
				this.$nuxt.$emit('contentModified');
				// console.log(val);
			},
			deep: true,
		},
	},
	mounted() {
		// When an element is created, scroll to it
		this.$refs.feature.scrollIntoView({ behavior: 'smooth' });
	},
	methods: {
		emitChangeStyle() {
			this.$nuxt.$emit(
				'changeStyle',
				this.feature,
				this.form.color,
				this.form.dash,
				this.form.width
			);
		},
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
			this.$bvModal
				.msgBoxConfirm('Biztosan törli a kiválasztott elemet?', {
					title: 'Megerősítés',
					size: 'sm',
					buttonSize: 'sm',
					okVariant: 'danger',
					okTitle: 'IGEN',
					cancelTitle: 'MÉGSEM',
					footerClass: 'p-2',
					hideHeaderClose: false,
					centered: true,
					autoFocusButton: 'ok',
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
		},
	},
};
</script>

<style scoped>
.list-group-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.5rem 1rem;
	border-left: 5px solid transparent;
}
.selected > span:first-child {
	font-weight: bold;
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
