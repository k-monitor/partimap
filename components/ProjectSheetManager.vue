<template>
	<b-container class="mb-5">
		<b-card class="shadow-sm ">
			<template #header>
				<form @submit.prevent="$emit('addSheet',newSheetTitle); newSheetTitle=''">
					<div class="input-group">
						<input
							v-model="newSheetTitle"
							class="form-control"
							placeholder="Új munkalap elnevezése"
							required
							type="text"
						>
						<div class="input-group-append">
							<button
								class="btn btn-outline-success"
								type="submit"
							>
								Hozzáadás
							</button>
						</div>
					</div>
				</form>
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
				</nuxtlink>
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
			newSheetTitle: ''
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
				return 'border_clear';
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
</style>
