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
					<a
						v-if="p.submissions"
						:href="'/api/submission/export/' + p.id"
						target="_blank"
					>Riport letöltése</a>
				</div>
				<span
					class="ml-auto text-danger"
					role="button"
					@click.prevent="del(p)"
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
					privacyPolicy: `Adatkezelő és adatfeldolgozó: ${this.$auth.user.name} <${this.$auth.user.email}>`,
				});
				this.$router.push({ path: `/admin/project/${id}` });
			} catch (error) {
				this.errorToast('Létrehozás sikertelen');
			}
		},
		async del(project) {
			const confirmed = await this.confirmDeletion(project.title);
			if (confirmed) {
				try {
					await this.$axios.$delete('/api/project/' + project.id);
					this.projects = await this.$axios.$get('/api/projects');
				} catch (error) {
					this.errorToast('Sikertelen törlés.');
				}
			}
		},
	},
};
</script>
