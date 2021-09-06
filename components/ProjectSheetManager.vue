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
					<strong>{{ sheet.title }}</strong>
					<b-badge class="float-left mr-3 my-1 order-number">
						#{{ sheet.ord + 1 }}
					</b-badge>
					<span
						class="material-icons delete m-0 float-right text-danger"
						@mousedown.prevent="showConfirmModal(sheet)"
					>
						delete
					</span>
					<span
						:class="{'down-arrow-disabled' : sheet.ord == (sheets.length-1)}"
						class="material-icons m-0 float-right"
						@click.prevent="$emit('moveSheet','down',sheet)"
					>
						arrow_downward
					</span>
					<span
						v-if="sheet.ord"
						class="material-icons m-0 float-right "
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
  cursor: pointer;
  opacity: 0.5;
}
.material-icons:hover {
  opacity: 1;
}

.order-number {
    letter-spacing: 0.1rem;
}

.down-arrow-disabled {
	pointer-events: none;
	opacity: 0;
}
</style>
