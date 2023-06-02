<template>
	<b-modal
		id="create-sheet-modal"
		ref="modal"
		:title="$t('ProjectSheetManager.title')"
		:cancel-title="$t('ProjectSheetManager.cancel')"
		ok-variant="success"
		@show="resetModal"
		@shown="$refs.sheetNameInput.focus()"
		@hidden="resetModal"
		@ok="handleOk"
	>
		<form
			ref="form"
			@submit.stop.prevent="handleSubmit"
		>
			<b-form-group
				:label="$t('ProjectSheetManager.sheetName')"
				:invalid-feedback="$t('ProjectSheetManager.sheetNameRequired')"
				:state="nameState"
			>
				<b-form-input
					ref="sheetNameInput"
					v-model="newSheetTitle"
					:state="nameState"
					required
				/>
			</b-form-group>

			<p class="pb-3">
				{{ $t('ProjectSheetManager.sheetType') }}
			</p>
			<div class="d-flex justify-content-between">
				<span
					v-for="t in sheetTypes"
					:key="t.name"
					v-b-tooltip.hover
					:title="t.tooltip"
					:class="
						newSheetType === t.name
							? 'text-success border border-success'
							: 'text-muted'
					"
					class="btn btn-link"
					role="button"
					@click="toggleSheetType(t.name)"
				>
					<i
						:class="t.icon"
						class="fas fa-fw fa-2x"
					/>
				</span>
			</div>

			<b-form-group
				v-if="'staticMap;interactiveMap'.includes(newSheetType)"
			>
				<label for="sourceMap">{{
					$t('ProjectSheetManager.copyFeaturesFrom')
				}}</label>
				<b-form-select
					id="sourceMap"
					v-model="sourceMap"
					:options="
						[
							{
								value: null,
								text: $t('ProjectSheetManager.withoutCopying'),
							},
						].concat(maps)
					"
				/>
			</b-form-group>
		</form>
	</b-modal>
</template>

<script>
import { Interactions } from '~/assets/interactions';
import sheetTypes from '~/assets/sheetTypes';

export default {
	props: {
		projectId: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			maps: [],
			nameState: null,
			newSheetTitle: '',
			newSheetType: null,

			sourceMap: null,
		};
	},
	async fetch() {
		const maps = await this.$axios.$get('/api/maps');
		this.maps = maps
			.map(m => ({
				...m,
				featureCount: JSON.parse(m.features || '[]').length,
			}))
			.filter(m => m.featureCount > 0)
			.map(m => ({
				value: m.id,
				text: `${m.title} (${m.featureCount} elem)`, // TODO i18n
			}));
	},
	computed: {
		sheetTypes() {
			return sheetTypes.map(t => ({
				...t,
				tooltip: this.$t(`ProjectSheetManager.sheetTypes.${t.name}`),
			}));
		},
	},
	methods: {
		checkFormValidity() {
			const valid = this.$refs.form.checkValidity();
			this.nameState = valid;
			return valid;
		},
		handleOk(bvModalEvt) {
			bvModalEvt.preventDefault(); // prevent modal close
			this.handleSubmit();
		},
		async handleSubmit() {
			if (!this.checkFormValidity()) return;

			let initialFeatures = [];
			if (this.sourceMap) {
				const m = await this.$axios.$get('/api/map/' + this.sourceMap);
				initialFeatures = m.features;
			}

			const sheetData = {};
			sheetData.title = this.newSheetTitle;
			if (this.newSheetType === 'survey') {
				sheetData.survey = {};
			} else if (this.newSheetType.match(/map$/i)) {
				// staticMap / interactiveMap
				sheetData.features = initialFeatures;
				if (this.newSheetType.startsWith('interactive')) {
					// interactiveMap
					sheetData.interactions = new Interactions({
						enabled: ['Point'],
					});
				} else {
					// staticMap has optional survey too
					sheetData.survey = {};
				}
			}

			try {
				const newSheet = await this.$axios.$put(
					'/api/project/' + this.projectId + '/sheet',
					sheetData
				);

				this.$nextTick(() => {
					this.$bvModal.hide('create-sheet-modal');
					this.resetModal();
				});

				this.$emit('addedSheet', newSheet);
			} catch (error) {
				console.error(error);
				this.errorToast(this.$t('projectEditor.sheetCreationFailed'));
			}
		},
		resetModal() {
			this.newSheetTitle = '';
			this.newSheetType = '';
			this.nameState = null;
		},
		toggleSheetType(type) {
			if (type === this.newSheetType) {
				this.newSheetType = 'text';
			} else {
				this.newSheetType = type;
			}
		},
	},
};
</script>
