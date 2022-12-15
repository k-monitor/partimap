<template>
	<SheetFrame :background-image-url="backgroundImageData || sheet.image">
		<template v-if="sheet.features">
			<client-only>
				<Map :features="loadInitFeatures()" />
				<template #placeholder>
					<div class="h-100 position-absolute w-100 map" />
				</template>
			</client-only>
			<MapToolbar />
		</template>
		<Sidebar
			admin
			back-label="Vissza a projekthez"
			:content-modified="contentModified"
			:fixed="!sheet.features"
			:loading="loading"
			:show-next="!isLastSheet"
			show-prev
			@back="back"
			@next="next"
			@prev="prev"
			@save="save"
		>
			<b-form-group>
				<template #label>
					<h6 class="mb-0">Munkalap címe</h6>
				</template>
				<b-form-input
					v-model="sheet.title"
					size="lg"
				/>
			</b-form-group>
			<b-form-group
				class="rich"
				label="Munkalap leírása"
			>
				<client-only>
					<tiptap v-model="sheet.description" />
				</client-only>
			</b-form-group>
			<b-form-group
				v-if="!sheet.features"
				invalid-feedback="Maximális fájlméret: 5 MB"
				:state="backgroundImageState"
			>
				<template #label>
					<h6 class="mb-0">Háttérkép</h6>
				</template>
				<b-input-group v-if="!sheet.image">
					<b-form-file
						v-model="backgroundImage"
						accept="image/jpeg, image/png, image/webp"
						class="sheet-background-input"
						browse-text=""
						drop-placeholder="Húzd ide a fájlt!"
						placeholder="Kép tallózása..."
						:state="backgroundImageState"
					/>
					<template #append>
						<b-button
							:disabled="!backgroundImage"
							variant="outline-danger"
							@click="removeBackground"
						>
							<i class="fas fa-backspace" />
						</b-button>
					</template>
				</b-input-group>
				<b-button
					v-else
					class="w-100"
					variant="outline-danger"
					@click="removeBackground"
				>
					Kép törlése
				</b-button>
			</b-form-group>
			<b-form-group v-if="sheet.survey">
				<template #label>
					<h6 class="mb-0">Kérdőív</h6>
				</template>
				<SurveyEditor v-model="sheet.survey" />
			</b-form-group>
			<b-form-group v-if="interactionOptions.length">
				<template #label>
					<h6 class="mb-0">Látogatói interakciók</h6>
				</template>
				<b-form-checkbox-group
					v-model="interactions.enabled"
					:options="interactionOptions"
					stacked
				/>
			</b-form-group>
			<b-form-group
				v-if="isPointSelected"
				label="Instrukció pont felrajzolásához:"
			>
				<b-form-input v-model="interactions.buttonLabels.Point" />
			</b-form-group>
			<b-form-group
				v-if="isLineStringSelected"
				label="Instrukció vonal felrajzolásához:"
			>
				<b-form-input v-model="interactions.buttonLabels.LineString" />
			</b-form-group>
			<b-form-group
				v-if="isPolygonSelected"
				label="Instrukció terület felrajzolásához:"
			>
				<b-form-input v-model="interactions.buttonLabels.Polygon" />
			</b-form-group>
			<b-form-group
				v-if="isRatingSelected"
				label="Csillagok száma:"
				label-cols="7"
				label-for="stars"
			>
				<b-form-input
					id="stars"
					v-model.number="interactions.stars"
					max="10"
					min="1"
					type="number"
				/>
			</b-form-group>
			<b-form-group
				v-if="isInteractive"
				label="Felrajzolt elemekhez rendelt kérdés"
			>
				<b-form-input
					v-model="sheet.descriptionLabel"
					placeholder="Miért rajzoltad ezt fel?"
				/>
			</b-form-group>
			<FeatureList
				v-if="sheet.features"
				:init-feature-ratings="submittedRatings"
				:stars="interactions.stars"
			/>
		</Sidebar>
	</SheetFrame>
</template>

<script>
import GeoJSON from 'ol/format/GeoJSON';
import { mapGetters } from 'vuex';
import { deserializeInteractions, serializeInteractions } from '@/assets/interactions';

export default {
	components: {
		Map: () => (process.client ? import('@/components/Map') : null),
	},
	middleware: ['auth'],
	async asyncData({ $axios, store, params, redirect }) {
		store.commit('features/clear');
		try {
			const project = await $axios.$get(`/api/project/${params.id}`);
			const sheet = project.sheets[params.sheetord]; // sheets are ordered on server
			const interactions = deserializeInteractions(sheet?.interactions);
			const submittedRatings = await $axios.$get(
				`/api/submission/ratings/${sheet.id}`
			);
			return { project, sheet, interactions, submittedRatings };
		} catch (error) {
			redirect('/admin/project/' + params.id);
		}
	},
	data() {
		return {
			backgroundImage: null,
			backgroundImageData: null,
			backgroundImageState: null,
			contentModified: false,
			loading: true,
		};
	},
	head() {
		return {
			title: `Admin: ${this.project.title} (${
				Number(this.$route.params.sheetord) + 1
			}/${this.project.sheets.length})`,
		};
	},
	computed: {
		...mapGetters('features', ['getAllFeature']),
		...mapGetters('selected', ['getSelectedFeature']),
		interactionOptions() {
			const options = [];
			if (this.sheet.features) {
				// map sheet
				if (!this.sheet.survey) { // TODO i18n
					// interactive map sheet
					options.push(
						{ value: 'Point', text: 'Pont felrajzolása' },
						{ value: 'LineString', text: 'Vonal felrajzolása' },
						{ value: 'Polygon', text: 'Terület felrajzolása' }
					);
				} else {
					options.push({ value: 'Rating', text: 'Fix elemek értékelése' });
				}
			} else {
				options.push({ value: 'SocialSharing', text: 'Megosztás gombok' });
			}
			return options;
		},
		isFirstSheet() {
			return this.sheet.ord === 0;
		},
		isLastSheet() {
			return this.sheet.ord === this.project.sheets.length - 1;
		},
		isInteractive() {
			return this.isPointSelected || this.isLineStringSelected || this.isPolygonSelected;
		},
		isPointSelected() {
			return this.interactions.enabled.includes('Point');
		},
		isLineStringSelected() {
			return this.interactions.enabled.includes('LineString');
		},
		isPolygonSelected() {
			return this.interactions.enabled.includes('Polygon');
		},
		isRatingSelected() {
			return this.interactions.enabled.includes('Rating');
		},
	},
	watch: {
		backgroundImage(val) {
			this.contentModified = true;
			this.backgroundImageData = null;
			if (!val) {
				// clear validation error message on file removal
				this.backgroundImageState = null;
			} else {
				const valid = this.backgroundImage.size < 5 * 1024 * 1024;
				this.backgroundImageState = valid;
				if (valid) {
					const reader = new FileReader();
					reader.onloadend = () => {
						this.backgroundImageData = reader.result;
					};
					reader.readAsDataURL(val);
				}
			}
		},
		interactions: {
			handler(interactions) {
				this.sheet.interactions = serializeInteractions(interactions);
			},
			deep: true,
		},
		sheet: {
			handler() {
				this.contentModified = true;
			},
			deep: true,
		},
		getSelectedFeature(f) {
			if (f) {
				this.$store.commit('setSidebarVisible', true);
			}
		},
	},
	created() {
		this.$nuxt.$on('contentModified', () => {
			this.contentModified = true;
		});
	},
	beforeDestroy() {
		this.$nuxt.$off('contentModified');
	},
	mounted() {
		this.loading = false;
	},
	methods: {
		back() {
			this.$router.push(this.localePath(`/admin/project/${this.project.id}`));
		},
		featuresFromRaw(featuresRaw) {
			const features = JSON.parse(featuresRaw);
			const featureCollection = { type: 'FeatureCollection', features };
			return features ? new GeoJSON().readFeatures(featureCollection) : null;
		},
		goToSheetOrd(ord) {
			this.$router.push(
				this.$route.fullPath.replace(/[?#].*$/, '').replace(/\d+$/, ord)
			);
		},
		loadFeaturesFromStore() {
			const features = [];
			for (const f of this.getAllFeature) {
				const featureStr = new GeoJSON().writeFeature(f);
				features.push(JSON.parse(featureStr));
			}
			this.sheet.features = JSON.stringify(features);
		},
		loadInitFeatures() {
			return this.featuresFromRaw(this.sheet.features);
		},
		next() {
			this.goToSheetOrd(this.sheet.ord + 1);
		},
		prev() {
			if (this.isFirstSheet) {
				this.back();
			} else {
				this.goToSheetOrd(this.sheet.ord - 1);
			}
		},
		removeBackground() {
			this.backgroundImage = null;
			this.sheet.image = null;
		},
		async save() {
			if (this.sheet.features) {
				this.loadFeaturesFromStore();
			}
			this.loading = true;
			if (this.backgroundImage) {
				await this.uploadBackground();
			}
			try {
				this.sheet = await this.$axios.$patch('/api/sheet', this.sheet);
				this.$nextTick(() => {
					this.contentModified = false;
				});
				this.success('Módosítás sikeres.');
			} catch {
				this.errorToast('Módosítás sikertelen.');
			}
			this.loading = false;
		},
		async uploadBackground() {
			if (!this.backgroundImageState) {
				return;
			}
			const formData = new FormData();
			formData.append('image', this.backgroundImage);
			try {
				this.sheet = await this.$axios.$put(
					'/api/sheet/' + this.sheet.id + '/image',
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					}
				);
				this.backgroundImage = null;
			} catch (error) {
				this.errorToast('Kép feltöltése sikertelen.');
			}
		},
	},
};
</script>

<style>
.sheet-background-input .custom-file-label::after {
	/* does not work in scoped style block */
	display: none !important;
}
</style>
