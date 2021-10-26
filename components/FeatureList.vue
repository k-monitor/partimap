<template>
	<div>
		<h6>Térkép elemei</h6>
		<b-form-group class="mb-4">
			<vue-typeahead-bootstrap
				v-model="search"
				placeholder="Keresés..."
				:data="categories"
				:min-matching-chars="0"
				:show-all-results="true"
				:show-on-focus="true"
			>
				<template #append>
					<b-button
						:disabled="!search"
						variant="outline-secondary"
						@click="search=''"
					>
						<i class="fas fa-backspace" />
					</b-button>
				</template>
			</vue-typeahead-bootstrap>
		</b-form-group>
		<b-list-group>
			<FeatureListElement
				v-for="feature in filteredFeatures"
				:key="feature.getId()"
				:categories="categories"
				:feature="feature"
				:init-feature-rating="getFeatureRating(feature.getId())"
				:visitor="visitor"
				@categoryEdited="updateCategories"
			/>
		</b-list-group>
		<p
			v-if="search && !filteredFeatures.length"
			class="font-italic text-muted"
		>
			Nem található ilyen elem a térképen.
		</p>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import VueTypeaheadBootstrap from 'vue-typeahead-bootstrap';

export default {
	components: {
		VueTypeaheadBootstrap,
	},
	props: {
		initFeatureRatings: {
			type: Object,
			default: () => {},
		},
		visitor: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			categories: [],
			search: '',
		};
	},
	computed: {
		...mapGetters({
			getAllFeatures: 'features/getAllFeature',
			getSelectedFeature: 'selected/getSelectedFeature',
		}),
		filteredFeatures() {
			return this.getAllFeatures.filter(
				f =>
					String(f.getId() || '')
						.toLowerCase()
						.includes(this.search.toLowerCase()) ||
					(f.get('name') || '')
						.toLowerCase()
						.includes(this.search.toLowerCase()) ||
					(f.get('category') || '')
						.toLowerCase()
						.includes(this.search.toLowerCase())
			);
		},
	},
	watch: {
		getSelectedFeature(f) {
			if (f) {
				const id = f.getId();
				const ids = this.filteredFeatures.map(f => f.getId());
				if (!ids.includes(id)) {
					// selected feature doesn't match current search filter
					// it means that click was on the map, we must show the
					// feature to the user -> we should reset search filter
					this.search = '';
				}
			}
		},
	},
	mounted() {
		this.updateCategories();
	},
	methods: {
		getFeatureRating(featureId) {
			const dict = this.initFeatureRatings || {};
			return Number(dict[featureId.toString()] || 0);
		},
		updateCategories() {
			const cats = new Set(
				this.getAllFeatures
					.map(f => (f.get('category') || '').trim())
					.filter(f => f.length)
			);
			this.categories = Array.from(cats);
		},
	},
};
</script>
