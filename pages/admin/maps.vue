<template>
	<AdminFrame>
		<template #header>
			Térképek
		</template>

		<div class="row">
			<div class="col-12 col-md-8">
				<form @submit.prevent="add">
					<div class="input-group mb-3">
						<input
							v-model="newMapTitle"
							class="form-control"
							placeholder="Új térkép elnevezése"
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
			</div>
			<div class="col">
				<div class="form-group mb-3 mx-auto">
					<input
						v-model="filter"
						class="form-control"
						placeholder="Szűrés"
						type="text"
					>
				</div>
			</div>
		</div>
		<div class="list-group">
			<NuxtLink
				v-for="m in filteredMaps"
				:key="m.id"
				:to="'/admin/map/' + m.id"
				class="align-items-center list-group-item list-group-item-action"
			>
				<span><strong>{{ m.title }}</strong></span>
				<span
					v-if="m.userId != $auth.user.id"
					class="badge badge-warning"
				>Tulajdonos: #{{ m.userId }}</span>
				<span
					v-else-if="$auth.user.isAdmin"
					class="badge badge-success"
				>Saját</span>
				<span class="material-icons m-0 float-right text-danger" @click.prevent="showConfirmModal(m.id)"> delete </span>
			</NuxtLink>
		</div>
	</AdminFrame>
</template>

<script>
export default {
	middleware: ['auth'],
	async asyncData({ $axios }) {
		const maps = await $axios.$get('/api/maps');
		return { maps };
	},
	data() {
		return {
			filter: '',
			newMapTitle: null,
			maps: [],
		};
	},
	head: {
		title: 'Admin: Térképek',
	},
	computed: {
		filteredMaps() {
			return this.maps.filter(
				m =>
					m.title.toLowerCase().includes(this.filter.toLowerCase()) ||
					(m.description || '')
						.toLowerCase()
						.includes(this.filter.toLowerCase())
			);
		},
	},
	methods: {
		async add() {
			try {
				const { id } = await this.$axios.$put('/api/map', {
					title: this.newMapTitle,
				});
				this.$router.push({ path: `/admin/map/${id}` });
			} catch (error) {
				this.error('Létrehozás sikertelen');
			}
		},
		async removeMapFromDB(id) {
			try {
				await this.$axios.$delete('/api/map/' + id);
			} catch (error) {
				this.error('Sikertelen törlés.');
			}
		},
		showConfirmModal(id) {
			this.$bvModal.msgBoxConfirm('Biztosan törli a kiválasztott elemet?', {
				title: 'Megerősítés',
				size: 'sm',
				buttonSize: 'sm',
				okVariant: 'danger',
				okTitle: 'IGEN',
				cancelTitle: 'MÉGSEM',
				footerClass: 'p-2',
				hideHeaderClose: false,
				centered: true
			})
				.then(value => {
					if (value) {
						this.removeMapFromDB(id);
						this.maps = this.maps.filter(function(map) { return map.id !== id; });
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
	},
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
</style>
