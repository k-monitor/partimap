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
					</form>
					<b-form-group>
						<label
							for="type-selector"
							class="pb-3"
						>Munkalap típusa:</label>
						<b-row
							id="type-selector"
							align-h="around"
							class="sheet-types"
						>
							<b-col cols="auto">
								<span
									v-b-tooltip.hover
									title="Szöveges munkalap (alapértelmezett)"
									:class="[newSheetType === 'text' ? ['text-success','selected'] : '' ]"
									class="material-icons clickable"
									@click="toggleSheetType('text')"
								>
									description
								</span>
							</b-col>
							<b-col cols="auto">
								<span
									v-b-tooltip.hover
									title="Kérdőíves munkalap"
									:class="[newSheetType === 'poll' ? ['text-success','selected'] : '' ]"
									class="material-icons clickable"
									@click="toggleSheetType('poll')"
								>
									poll
								</span>
							</b-col>
							<b-col cols="auto">
								<span
									v-b-tooltip.hover
									title="Térképes munkalap (statikus)"
									:class="[newSheetType === 'staticMap' ? ['text-success','selected'] : '' ]"
									class="material-icons clickable"
									@click="toggleSheetType('staticMap')"
								>
									map
								</span>
							</b-col>
							<b-col cols="auto">
								<span
									v-b-tooltip.hover
									title="Térképes munkalap (interaktív)"
									:class="[newSheetType === 'interactiveMap' ? ['text-success','selected'] : '' ]"
									class="material-icons clickable"
									@click="toggleSheetType('interactiveMap')"
								>
									location_on
								</span>
							</b-col>
							<b-col cols="auto">
								<span
									v-b-tooltip.hover
									title="Demográfiai kérdőíves munkalap"
									:class="[newSheetType === 'demographicsPoll' ? ['text-success','selected'] : '' ]"
									class="material-icons clickable"
									@click="toggleSheetType('demographicsPoll')"
								>
									groups
								</span>
							</b-col>
						</b-row>
					</b-form-group>
					<b-form-group v-if="'staticMap;interactiveMap'.includes(newSheetType)">
						<label for="sourceMap">Térkép elemek másolása innen:</label>
						<b-form-select
							id="sourceMap"
							v-model="sourceMap"
							:options="[{value: null, text: 'Nincs másolás'}].concat(maps)"
						/>
					</b-form-group>
				</b-modal>
			</template>
			<div class="list-group">
				<NuxtLink
					v-for="sheet in sheets"
					:key="sheet.ord"
					:to="'/admin/project/' + projectId + '/sheet/' + sheet.ord"
					class="align-items-center list-group-item list-group-item-action py-0"
				>
					<b-row
						align-v="center"
						class="px-2 py-3"
					>
						<div style="width: 70px;">
							<span
								class="material-icons  float-left mr-3"
								@mousedown.prevent="showConfirmModal(sheet)"
							>
								{{ getSheetType(sheet) }}
							</span>
							<span>{{ sheet.ord + 1 }}.</span>
						</div>
						<b-col>
							<strong>{{ sheet.title }}</strong>
							<span v-if="sheet.submittedFeatureCount">
								<br>
								{{ sheet.submittedFeatureCount }} beküldött térkép elem
								<a href="javascript:void(0)" @click.prevent="submittedFeaturesToMap(sheet)">Új saját térképre küldés</a>
							</span>
						</b-col>
						<div style="width: 90px">
							<span
								class="material-icons clickable delete text-danger float-right"
								@mousedown.prevent="showConfirmModal(sheet)"
							>
								delete
							</span>
							<span
								:class="{'down-arrow-disabled' : sheet.ord == (sheets.length-1)}"
								class="material-icons clickable float-right mr-3"
								@click.prevent="$emit('moveSheet','down',sheet)"
							>
								arrow_downward
							</span>
							<span
								v-if="sheet.ord"
								class="material-icons clickable float-right"
								@click.prevent="$emit('moveSheet','up',sheet)"
							>
								arrow_upward
							</span>
						</div>
					</b-row>
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
		project: { // TODO makes sheets and projectId props redundant
			type: Object,
			default: null
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
		getSheetType(sheet) {
			if (sheet.features) {
				return JSON.parse(sheet.interactions || '[]').length
					? 'location_on'
					: 'map';
			} else if (sheet.survey) {
				return 'poll';
			} else {
				return 'description';
			}
		},
		showConfirmModal(sheet) {
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
				title: `${this.project.title} / ${sheet.title} ${new Date().toLocaleString()}`,
				importSubmittedFeatures: sheet.id
			};
			const map = await this.$axios.$put('/api/map', data);
			this.$router.push('/admin/map/' + map.id);
		},
	},
};
</script>

<style scoped>
.material-icons {
	font-size: 24px;
}

.material-icons.clickable {
	cursor: pointer;
	opacity: 0.5;
}
.material-icons.clickable:hover {
	opacity: 1;
}

.material-icons.down-arrow-disabled {
	pointer-events: none;
	opacity: 0;
}

.material-icons.selected {
	opacity: 1;
}

.sheet-types .material-icons {
	font-size: 30px;
}
</style>
