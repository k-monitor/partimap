<template>
	<b-container class="mb-5">
		<b-card class="shadow-sm ">
			<template #header>
				<b-button
					v-b-modal.create-sheet-modal
					class="float-right"
					variant="outline-success"
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
					<form ref="form" @submit.stop.prevent="handleSubmit">
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
					<label for="type-selector" class="pb-3">Munkalap típusa:</label>
					<b-row id="type-selector" align-h="around" class="sheet-types">
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
				</b-modal>
			</template>
			<div class="list-group">
				<NuxtLink
					v-for="sheet in sheets"
					:key="sheet.ord"
					:to="'/admin/project/' + projectId + '/sheet/' + sheet.ord"
					class="align-items-center list-group-item list-group-item-action py-0"
				>
					<b-row align-v="center" class="px-2 py-3">
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
			default: 0
		},
		sheets: {}
	},
	data() {
		return {
			newSheetTitle: '',
			newSheetType: 'text',
			nameState: null
		};
	},
	methods: {
		getSheetType(sheet) {
			if (sheet.image) {
				return 'image';
			} else if (sheet.survey) {
				return 'poll';
			} else if (sheet.features) {
				return 'map';
			} else {
				return 'description';
			}
		},
		showConfirmModal(sheet) {
			this.$bvModal.msgBoxConfirm('Biztosan törli a kiválasztott elemet?', {
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
			this.$emit('addSheet', this.newSheetTitle, this.newSheetType);
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
		}
	}
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
