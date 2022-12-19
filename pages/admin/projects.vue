<template>
	<AdminFrame>
		<template #header>
			{{$t('Projects.projects')}}
		</template>

		<div class="row">
			<div class="col-12 col-md-7">
				<form @submit.prevent="add">
					<div class="input-group mb-3">
						<input
							v-model="newProjectTitle"
							class="form-control"
							:placeholder="$t('Projects.newProjectName')"
							required
							type="text"
						>
						<div class="input-group-append">
							<button
								class="btn btn-outline-success"
								type="submit"
							>
								{{$t('Projects.add')}}
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
						:placeholder="$t('Projects.filter')"
						type="text"
					>
				</div>
			</div>
			<div v-if="$auth.user.isAdmin" class="col col-mr-0">
				<input
					class="btn btn-outline-primary form-control"
					:class="{active: filterOwn}"
					type="button"
					:value="$t('Projects.ownProjects')"
					@click="filteredOwn(filterOwn)"
				>
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
						:to="localePath('/admin/project/' + p.id)"
						class="font-weight-bold mr-2"
					>
						{{ p.title }}
					</NuxtLink>
					<span
						v-if="p.userId != $auth.user.id"
						class="badge badge-warning"
					>{{$t('Projects.owner')}}: #{{ p.userId }}</span>
					<span
						v-else-if="$auth.user.isAdmin"
						class="badge badge-info"
					>Saját</span>
					<br>
					{{ p.views }} {{$t('Projects.view')}}, {{ p.submissions }} {{$t('Projects.view')}}
					<a
						v-if="p.submissions"
						:href="'/api/submission/export/' + p.id"
						target="_blank"
					>{{$t('Projects.riportsDownload')}}</a>
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
			filterOwn: false,
		};
	},
	head() {
		return {
			title: this.$t('Projects.adminProjects')
		};
	},
	computed: {
		filteredProjects() {
			return this.projects.filter(
				p => {
					const f = this.filter.toLowerCase();
					const t = p.title.toLowerCase();
					const d = (p.description || '').toLowerCase();
					if (this.filterOwn && this.$auth.user.id !== p.userId) {
						return false;
					}
					// eslint-disable-next-line no-unreachable
					return t.includes(f) || d.includes(f);
				});
		},
	},
	methods: {
		async add() {
			try {
				const { id } = await this.$axios.$put('/api/project', {
					title: this.newProjectTitle,
					privacyPolicy: `<p>${this.$t('Projects.name')}: ${this.$auth.user.name}</p><p>E-mail: <a href="mailto:${this.$auth.user.email}">${this.$auth.user.email}</a></p>`,
				});
				this.$router.push(this.localePath(`/admin/project/${id}`));
			} catch (error) {
				this.errorToast(this.$t('Projects.creationFailed'));
			}
		},
		async del(project) {
			const confirmed = await this.confirmDeletion(project.title);
			if (confirmed) {
				try {
					await this.$axios.$delete('/api/project/' + project.id);
					this.projects = await this.$axios.$get('/api/projects');
				} catch (error) {
					this.errorToast(this.$t('Projects.deleteFailed'));
				}
			}
		},
		filteredOwn(toggle) {
			this.filterOwn = !toggle;
		},
	},
};

</script>
