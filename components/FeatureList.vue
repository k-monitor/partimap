<template>
	<div>
		<b-form-group class="mb-4">
			<template #label>
				<h6 class="mb-0">Térkép elemei</h6>
			</template>
			<vue-typeahead-bootstrap
				v-model="search"
				placeholder="Keresés..."
				:data="categories"
				:min-matching-chars="0"
				show-all-results
				show-on-focus
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
			<b-badge
				v-for="c in categories"
				:key="c"
				class="border border-secondary m-2"
				role="button"
				variant="light"
				@click="search=c"
				v-text="c"
			/>
		</b-form-group>
		<b-form-group
			v-if="filteredVisitorFeatures.length"
			label="Saját elemeid"
		>
			<b-list-group>
				<FeatureListElement
					v-for="feature in filteredVisitorFeatures"
					:key="feature.getId()"
					:categories="categories"
					:feature="feature"
					:init-feature-rating="getFeatureRating(feature.getId())"
					:visitor="visitor"
					@categoryEdited="updateCategories"
				/>
			</b-list-group>
		</b-form-group>
		<b-form-group :label="filteredVisitorFeatures.length ? 'Fix elemek' : null">
			<b-list-group>
				<FeatureListElement
					v-for="feature in filteredAdminFeatures"
					:key="feature.getId()"
					:categories="categories"
					:feature="feature"
					:init-feature-rating="getFeatureRating(feature.getId())"
					:visitor="visitor"
					:visitor-can-rate="visitorCanRate"
					@categoryEdited="updateCategories"
				/>
			</b-list-group>
		</b-form-group>
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
		visitorCanRate: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			categories: [],
			filteredFeatures: [],
			search: '',
		};
	},
	computed: {
		...mapGetters({
			getAllFeatures: 'features/getAllFeature',
			getSelectedFeature: 'selected/getSelectedFeature',
		}),
		filteredAdminFeatures() {
			return this.filteredFeatures.filter(f => !f.get('visitorFeature'));
		},
		filteredVisitorFeatures() {
			return this.filteredFeatures.filter(f => f.get('visitorFeature'));
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
			this.updateFilteredFeatures();
		},
		getAllFeatures() {
			this.updateFilteredFeatures();
		},
		search() {
			this.updateFilteredFeatures();
		},
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
		updateFilteredFeatures() {
			this.filteredFeatures = this.getAllFeatures
				.filter(
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
				)
				.sort((a, b) => {
					const ac = a.get('category') || '';
					const bc = b.get('category') || '';
					if (ac === bc) {
						const an = a.get('name') || a.getId();
						const bn = b.get('name') || b.getId();
						return String(an).localeCompare(String(bn));
					}
					return String(ac).localeCompare(String(bc));
				});
		},
	},
};
</script>
