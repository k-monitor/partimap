<template>
	<b-container class="mb-5">
		<b-card class="shadow-sm ">
			<template #header>
				<b-button
					v-b-modal.create-sheet-modal
					class="float-right"
					variant="success"
					type="button"
				>
					Munkalap hozzáadása
				</b-button>
				<b-modal
					id="create-sheet-modal"
					ref="modal"
					title="Új munkalap"
					cancel-title="Mégsem"
					ok-variant="success"
					@show="resetModal"
					@hidden="resetModal"
					@ok="handleOk"
				>
					<form
						ref="form"
						@submit.stop.prevent="handleSubmit"
					>
						<b-form-group
							label="Munkalap elnevezése:"
							label-for="name-input"
							invalid-feedback="Név megadása kötelező"
							:state="nameState"
						>
							<b-form-input
								id="name-input"
								v-model="newSheetTitle"
								:state="nameState"
								required
							/>
						</b-form-group>

						<p class="pb-3">Munkalap típusa:</p>
						<div class="d-flex justify-content-between">
							<button
								v-for="t in sheetTypes"
								:key="t.name"
								v-b-tooltip.hover
								:title="t.tooltip"
								:class="newSheetType === t.name ? 'text-success border border-success': 'text-muted'"
								class="btn btn-link"
								@click="toggleSheetType(t.name)"
							>
								<i
									:class="t.icon"
									class="fas fa-fw fa-2x"
								/>
							</button>
						</div>

						<b-form-group v-if="'staticMap;interactiveMap'.includes(newSheetType)">
							<label for="sourceMap">Térkép elemek másolása innen:</label>
							<b-form-select
								id="sourceMap"
								v-model="sourceMap"
								:options="[{value: null, text: 'Nincs másolás'}].concat(maps)"
							/>
						</b-form-group>
					</form>
				</b-modal>
			</template>
			<div class="list-group">
				<NuxtLink
					v-for="sheet in sheets"
					:key="sheet.ord"
					:to="'/admin/project/' + projectId + '/sheet/' + sheet.ord"
					class="align-items-center d-flex list-group-item list-group-item-action"
				>
					<i
						:class="sheetIcon(sheet)"
						class="fas fa-fw mr-3"
					/>
					<span class="mr-3">{{ sheet.ord + 1 }}.</span>
					<div>
						<strong class="mr-2">{{ sheet.title }}</strong>
						<span v-if="sheet.submittedFeatureCount">
							<br>
							{{ sheet.submittedFeatureCount }} beküldött térkép elem
							<a
								href="javascript:void(0)"
								@click.prevent="submittedFeaturesToMap(sheet)"
							>Új saját térképre küldés</a>
						</span>
					</div>
					<div class="ml-auto">
						<span
							v-if="sheet.ord"
							class="mr-3"
							role="button"
							@click.prevent="$emit('moveSheet','up',sheet)"
						>
							<i class="fas fa-fw fa-arrow-up" />
						</span>
						<span
							v-if="(sheet.ord || 0) < sheets.length - 1"
							class="mr-3"
							role="button"
							@click.prevent="$emit('moveSheet','down',sheet)"
						>
							<i class="fas fa-fw fa-arrow-down" />
						</span>
						<span
							class="text-danger"
							role="button"
							@click.prevent="showConfirmModal(sheet)"
						>
							<i class="fas fa-fw fa-trash" />
						</span>
					</div>
				</NuxtLink>
			</div>
		</b-card>
	</b-container>
</template>

<script>
export default {
	props: {
		projectId: {
			type: Number,
			default: 0,
		},
		project: {
			// TODO makes sheets and projectId props redundant
			type: Object,
			default: null,
		},
		sheets: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			maps: [],
			newSheetTitle: '',
			newSheetType: 'text',
			sheetTypes: [
				{
					name: 'text',
					icon: 'fa-paragraph',
					tooltip: 'Szöveg',
				},
				{
					name: 'poll',
					icon: 'fa-poll',
					tooltip: 'Kérdőív',
				},
				{
					name: 'staticMap',
					icon: 'fa-map',
					tooltip: 'Térkép',
				},
				{
					name: 'interactiveMap',
					icon: 'fa-map-marker-alt',
					tooltip: 'Interaktív térkép',
				},
				{
					name: 'demographicsPoll',
					icon: 'fa-users',
					tooltip: 'Demográfiai kérdőív',
				},
			],
			nameState: null,
			sourceMap: null,
		};
	},
	async fetch() {
		const maps = await this.$axios.$get('/api/maps');
		this.maps = maps
			.map(m => ({ ...m, featureCount: JSON.parse(m.features || '[]').length }))
			.filter(m => m.featureCount > 0)
			.map(m => ({
				value: m.id,
				text: `${m.title} (${m.featureCount} elem)`,
			}));
	},
	methods: {
		sheetType(sheet) {
			if (!sheet) {
				return null;
			}
			// This does not differentiate "poll" and "demographicsPoll"
			// since there's no marker for the latter in the Sheet record.
			if (sheet.features) {
				return JSON.parse(sheet.interactions || '[]').length
					? 'interactiveMap'
					: 'staticMap';
			} else if (sheet.survey) {
				return 'poll';
			} else {
				return 'text';
			}
		},
		sheetIcon(sheet) {
			const type = this.sheetType(sheet);
			return this.sheetTypes.filter(t => t.name === type)[0].icon;
		},
		showConfirmModal(sheet) {
			this.$bvModal
				.msgBoxConfirm('Biztosan törli a kiválasztott elemet?', {
					title: 'Megerősítés',
					size: 'sm',
					buttonSize: 'sm',
					okVariant: 'danger',
					okTitle: 'Igen',
					cancelTitle: 'Mégsem',
					footerClass: 'p-2',
					hideHeaderClose: false,
					centered: true,
					autoFocusButton: 'ok',
				})
				.then(value => {
					if (value) {
						this.$emit('delSheet', sheet);
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		checkFormValidity() {
			const valid = this.$refs.form.checkValidity();
			this.nameState = valid;
			return valid;
		},
		resetModal() {
			this.newSheetTitle = '';
			this.nameState = null;
		},
		handleOk(bvModalEvt) {
			// Prevent modal from closing
			bvModalEvt.preventDefault();
			// Trigger submit handler
			this.handleSubmit();
		},
		handleSubmit() {
			// Exit when the form isn't valid
			if (!this.checkFormValidity()) {
				return;
			}
			// Create sheet
			this.$emit(
				'addSheet',
				this.newSheetTitle,
				this.newSheetType,
				this.sourceMap
			);
			this.newSheetTitle = '';
			this.newSheetType = '';
			// Hide the modal manually
			this.$nextTick(() => {
				this.$bvModal.hide('create-sheet-modal');
			});
		},
		toggleSheetType(type) {
			if (type === this.newSheetType) {
				this.newSheetType = 'text';
			} else {
				this.newSheetType = type;
			}
		},
		async submittedFeaturesToMap(sheet) {
			const data = {
				title: `${this.project.title} / ${
					sheet.title
				} ${new Date().toLocaleString()}`,
				importSubmittedFeatures: sheet.id,
			};
			const map = await this.$axios.$put('/api/map', data);
			this.$router.push('/admin/map/' + map.id);
		},
	},
};
</script>
