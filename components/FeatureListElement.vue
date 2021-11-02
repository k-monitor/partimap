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
			<span class="text-break">
				<i
					class="fas fa-fw mr-1"
					:class="icons[feature.getGeometry().getType()]"
				/>
				{{ form.name }}
			</span>
			<span
				v-if="editable"
				class="ml-auto text-danger"
				role="button"
				@click.stop="deleteFeature"
			>
				<i class="fas fa-trash" />
			</span>
			<span
				v-else
				class="ml-auto text-muted"
			>
				<i class="fas fa-lock" />
			</span>
		</b-list-group-item>
		<b-collapse
			:id="`collapse-${feature.getId()}`"
			:visible="selectedFeature"
			accordion="my-accordion"
			@shown="expandFinished()"
		>
			<b-card
				v-if="selectedFeature"
				body-class="pb-0"
				class="collapse-content"
			>
				<div v-if="editable">
					<b-row
						v-if="!visitor"
						align-h="between"
						align-v="center"
					>
						<b-col>
							<b-form-group label="Szín">
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
							</b-form-group>
						</b-col>
						<b-col>
							<b-form-group label="Méret">
								<b-form-input
									v-model="form.width"
									size="sm"
									type="number"
								/>
							</b-form-group>
						</b-col>
					</b-row>
					<b-form-group
						v-if="!visitor && feature.getGeometry().getType() !== 'Point'"
						label="Vonal"
					>
						<b-form-select
							v-model="form.dash"
							size="sm"
							:options="dashOptions"
						/>
					</b-form-group>
					<b-form-group label="Név">
						<b-form-input
							id="type-text"
							v-model="form.name"
							size="sm"
							type="text"
						/>
					</b-form-group>
					<b-form-group
						v-if="!visitor"
						label="Kategória"
					>
						<vue-typeahead-bootstrap
							v-model="form.category"
							placeholder="Kategória"
							size="sm"
							:data="categories"
							:min-matching-chars="0"
							show-all-results
							show-on-focus
						/>
					</b-form-group>
					<b-form-group
						:label="visitor ? 'Miért rajzoltad ezt fel?' : 'Leírás'"
						:description="(form.description || '').length + '/1000'"
					>
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
					</b-form-group>
				</div>
				<div v-else>
					<p v-if="form.category">{{ form.category }}</p>
					<p v-if="form.description">{{ form.description }}</p>
				</div>
				<b-form-group v-if="(visitor && !editable && visitorCanRate) || (!visitor && rating)">
					<b-form-rating
						v-model="rating"
						precision="1"
						:readonly="!visitor"
						:show-value="!visitor"
						:variant="visitor ? 'warning' : 'info'"
					/>
				</b-form-group>
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
			default: () => [],
		},
		feature: {
			type: Feature,
			default: new Feature(),
		},
		initFeatureRating: {
			type: Number,
			default: null,
		},
		visitor: {
			type: Boolean,
			default: false,
		},
		visitorCanRate: {
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
			rating: this.initFeatureRating,
			dashOptions: [
				{ text: 'Folytonos', value: '0' },
				{ text: 'Pontozott', value: '1,1' },
				{ text: 'Szaggatott', value: '2,1' },
				{ text: 'Hosszan szagg.', value: '4,1' },
				{ text: 'Pont-vonal', value: '1,1,3,1' },
			],
			editable: !this.visitor || this.feature.get('visitorFeature'),
			icons: {
				Point: 'fa-map-marker-alt',
				LineString: 'fa-route',
				Polygon: 'fa-draw-polygon',
			},
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
		rating(rating) {
			this.$nuxt.$emit('featureRatedByVisitor', this.feature.getId(), rating);
		},
		form: {
			handler(val) {
				this.$nuxt.$emit('contentModified');
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
		async deleteFeature() {
			const confirmed = await this.confirmDeletion(
				this.form.name || this.feature.id
			);
			if (confirmed) {
				this.$nuxt.$emit('clearFeature', this.feature);
			}
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
