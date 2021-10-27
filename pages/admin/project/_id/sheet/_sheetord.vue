<template>
	<div
		class="flex-grow-1 sheet"
		:style="sheetStyle"
	>
		<template v-if="sheet.features">
			<client-only placeholder="Loading...">
				<Map :features="loadInitFeatures()" />
			</client-only>
			<MapToolbar />
		</template>
		<AdminSidebar
			back-label="Projekt"
			:content-modified="contentModified"
			@back="back"
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
			<b-form-group>
				<template #label>
					<div class="align-items-center d-flex justify-content-between">
						<h6 class="mb-0">Munkalap leírása</h6>
						<b-badge variant="secondary">{{ (sheet.description || '').length }} / 1000</b-badge>
					</div>
				</template>
				<b-textarea
					v-model="sheet.description"
					maxlength="1000"
					rows="6"
				/>
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
						browse-text=""
						drop-placeholder="Húzza ide a fájlt!"
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
				<SurveyEditor
					v-if="JSON.parse(sheet.survey).demographic"
					:value="demographicSurvey"
					:readonly="true"
				/>
				<SurveyEditor
					v-else
					v-model="sheet.survey"
				/>
			</b-form-group>
			<b-form-group v-if="interactionOptions.length">
				<template #label>
					<h6 class="mb-0">Látogatói interakciók</h6>
				</template>
				<b-form-checkbox-group
					v-model="selectedInteractions"
					:options="interactionOptions"
				/>
			</b-form-group>
			<FeatureList v-if="sheet.features" />
		</AdminSidebar>
	</div>
</template>

<script>
import GeoJSON from 'ol/format/GeoJSON';

const demographicSurvey = JSON.stringify({
	demographic: true,
	questions: [
		{
			id: 1,
			label: 'Hány éves vagy?',
			type: 'number',
		},
		{
			id: 2,
			label: 'Nemed:',
			type: 'radiogroup',
			options: ['Férfi', 'Nő'],
		},
		{
			id: 3,
			label: 'Melyik szomszédságban élsz?',
			type: 'dropdown',
			options: ['Budapest', 'Vidék'],
		},
		{
			id: 4,
			label: 'E-mail cím',
			type: 'text',
		},
		{
			id: 5,
			label: 'Bármi hozzáfűznivaló:',
			type: 'text',
		},
	],
});

export default {
	components: {
		Map: () => (process.client ? import('@/components/Map') : null),
	},
	middleware: ['auth'],
	async asyncData({ $axios, store, params, redirect }) {
		store.commit('features/clear');
		try {
			const project = await $axios.$get('/api/project/' + params.id);
			const sheet = project.sheets[params.sheetord]; // sheets are ordered on server
			const selectedInteractions = sheet ? JSON.parse(sheet.interactions) : []; // for some reason I had to parse it here
			return { project, sheet, selectedInteractions };
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
			demographicSurvey,
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
		interactionOptions() {
			const options = [];
			if (!this.sheet.survey) {
				if (this.sheet.features) {
					options.push(
						{ value: 'Point', text: 'Pont' },
						{ value: 'LineString', text: 'Vonal' },
						{ value: 'Polygon', text: 'Terület' }
					);
				} else {
					options.push({ value: 'SocialSharing', text: 'Megosztás gombok' });
				}
			}
			return options;
		},
		sheetStyle() {
			return {
				backgroundImage: `url(${this.backgroundImageData || this.sheet.image})`,
			};
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
		sheet: {
			handler() {
				this.contentModified = true;
			},
			deep: true,
		},
		selectedInteractions(i) {
			this.sheet.interactions = JSON.stringify(i);
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
	methods: {
		async back() {
			if (this.contentModified) {
				const needSave = await this.askSaveModifications();
				if (needSave) {
					await this.save();
				} else if (needSave !== false) {
					return;
				}
			}
			this.$router.push('/admin/project/' + this.project.id);
		},
		featuresFromRaw(featuresRaw) {
			const features = JSON.parse(featuresRaw);
			const featureCollection = { type: 'FeatureCollection', features };
			return features ? new GeoJSON().readFeatures(featureCollection) : null;
		},
		loadFeaturesFromStore() {
			const features = [];
			for (const f of this.getAllFeature) {
				const featureStr = new GeoJSON().writeFeature(f);
				features.push(JSON.parse(featureStr));
			}
			this.sheet.features = features;
		},
		loadInitFeatures() {
			return this.featuresFromRaw(this.sheet.features);
		},
		removeBackground() {
			this.backgroundImage = null;
			this.sheet.image = null;
		},
		async save() {
			if (this.sheet.features) {
				this.loadFeaturesFromStore();
			}
			if (this.backgroundImage) {
				await this.uploadBackground();
			}
			try {
				await this.$axios.$patch('/api/sheet', this.sheet);
				this.contentModified = false;
				this.success('Módosítás sikeres.');
			} catch (error) {
				this.errorToast('Módosítás sikertelen.');
			}
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
.sheet {
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
}

.sheet .custom-file-label::after {
	/* does not work in scoped stlye block */
	display: none !important;
}
</style>
