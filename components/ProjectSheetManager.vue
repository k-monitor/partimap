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
					class="align-items-center list-group-item list-group-item-action"
				>
					<span class="float-left mr-3">{{ sheet.ord + 1 }}.</span>
					<strong>{{ sheet.title }}</strong>

					<!-- <b-badge class="float-left mr-3 my-1 order-number">
						#{{ sheet.ord + 1 }}
					</b-badge> -->
					<span
						class="material-icons m-0 mr-1 float-left"
						@mousedown.prevent="showConfirmModal(sheet)"
					>
						{{ getSheetType(sheet) }}
					</span>
					<span
						class="material-icons clickable delete m-0 float-right text-danger"
						@mousedown.prevent="showConfirmModal(sheet)"
					>
						delete
					</span>
					<span
						:class="{'down-arrow-disabled' : sheet.ord == (sheets.length-1)}"
						class="material-icons clickable m-0 float-right"
						@click.prevent="$emit('moveSheet','down',sheet)"
					>
						arrow_downward
					</span>
					<span
						v-if="sheet.ord"
						class="material-icons clickable m-0 float-right "
						@click.prevent="$emit('moveSheet','up',sheet)"
					>
						arrow_upward
					</span>
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
  margin-left: 10px;
}

.material-icons.clickable {
  cursor: pointer;
  opacity: 0.5;
}
.material-icons.clickable:hover {
  opacity: 1;
}

.order-number {
    letter-spacing: 0.1rem;
}

.material-icons.down-arrow-disabled {
	pointer-events: none;
	opacity: 0;
}
</style>
