<template>
	<AdminFrame>
		<template #header>
			Projektek
		</template>

		<div class="row">
			<div class="col-12 col-md-8">
				<form @submit.prevent="add">
					<div class="input-group mb-3">
						<input
							v-model="newProjectTitle"
							class="form-control"
							placeholder="Új projekt elnevezése"
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
			<div
				v-for="p in filteredProjects"
				:key="p.id"
				class="align-items-center d-flex list-group-item"
			>
				<div>
					<NuxtLink
						:to="'/admin/project/' + p.id"
						class="font-weight-bold mr-2"
					>
						{{ p.title }}
					</NuxtLink>
					<span
						v-if="p.userId != $auth.user.id"
						class="badge badge-warning"
					>Tulajdonos: #{{ p.userId }}</span>
					<span
						v-else-if="$auth.user.isAdmin"
						class="badge badge-info"
					>Saját</span>
					<br>
					{{ p.views }} megtekintés, {{ p.submissions }} kitöltés
				</div>
				<span
					class="ml-auto text-danger"
					role="button"
					@click.prevent="showConfirmModal(p.id)"
				>
					<i class="fas fa-trash" />
				</span>
			</div>
		</div>
	</AdminFrame>
</template>

<script>
export default {
	middleware: ['auth'],
	async asyncData({ $axios }) {
		const projects = await $axios.$get('/api/projects');
		return { projects };
	},
	data() {
		return {
			filter: '',
			newProjectTitle: null,
			projects: [],
		};
	},
	head: {
		title: 'Admin: Projektek',
	},
	computed: {
		filteredProjects() {
			return this.projects.filter(
				p =>
					p.title.toLowerCase().includes(this.filter.toLowerCase()) ||
					(p.description || '')
						.toLowerCase()
						.includes(this.filter.toLowerCase())
			);
		},
	},
	methods: {
		async add() {
			try {
				const { id } = await this.$axios.$put('/api/project', {
					title: this.newProjectTitle,
				});
				this.$router.push({ path: `/admin/project/${id}` });
			} catch (error) {
				this.errorToast('Létrehozás sikertelen');
			}
		},
		async removeProjFromDB(id) {
			try {
				await this.$axios.$delete('/api/project/' + id);
			} catch (error) {
				this.errorToast('Sikertelen törlés.');
			}
		},
		showConfirmModal(id) {
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
						this.removeProjFromDB(id);
						this.projects = this.projects.filter(function (proj) {
							return proj.id !== id;
						});
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
	},
};
</script>
