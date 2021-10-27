<template>
	<div
		class="flex-grow-1"
		:style="'background: center / cover no-repeat url(' + sheet.image + ')'"
	>
		<AdminSidebar
			back-label="Projekt"
			:content-modified="contentModified"
			@back="back"
			@save="save"
		>
			<b-form-group class="mb-4">
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
			if (this.sheet.features) {
				options.push(
					{ value: 'Point', text: 'Pont' },
					{ value: 'LineString', text: 'Vonal' },
					{ value: 'Polygon', text: 'Terület' }
				);
			} else if (!this.sheet.survey) {
				options.push({ value: 'SocialSharing', text: 'Megosztás gombok' });
			}
			return options;
		},
	},
	watch: {
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
		loadFeaturesFromStore() {
			const features = [];
			for (const f of this.getAllFeature) {
				const featureStr = new GeoJSON().writeFeature(f);
				features.push(JSON.parse(featureStr));
			}
			this.sheet.features = features;
		},
		async save() {
			if (this.sheet.features) {
				this.loadFeaturesFromStore();
			}
			try {
				await this.$axios.$patch('/api/sheet', this.sheet);
				this.contentModified = false;
				this.success('Módosítás sikeres.');
			} catch (error) {
				this.errorToast('Módosítás sikertelen.');
			}
		},
	},
};
</script>
