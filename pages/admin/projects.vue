<template>
	<AdminFrame>
		<template #header>
			{{ $t('projects.title') }}
		</template>

		<div class="row">
			<div class="col-12 col-md-7">
				<form @submit.prevent="add">
					<div class="input-group mb-3">
						<input
							v-model="newProjectTitle"
							class="form-control"
							:placeholder="$t('projects.newProjectName')"
							required
							type="text"
						/>
						<div class="input-group-append">
							<button
								class="btn btn-outline-success"
								type="submit"
							>
								{{ $t('projects.add') }}
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
						:placeholder="$t('projects.filter')"
						type="text"
					/>
				</div>
			</div>
			<div
				v-if="$auth.user.isAdmin"
				class="col col-mr-0"
			>
				<input
					class="btn btn-outline-primary form-control"
					:class="{ active: filterOwn }"
					type="button"
					:value="$t('projects.ownProjects')"
					@click="filteredOwn(filterOwn)"
				/>
			</div>
		</div>
		<div class="list-group">
			<ListItem
				v-for="p in filteredProjects"
				:key="p.id"
				:link="localePath('/admin/project/' + p.id)"
				:title="p.title"
				:user-id="p.userId"
				@clone="clone(p)"
				@del="del(p)"
			>
				<br />
				{{ $t('projects.views') }}: {{ p.views }},
				{{ $t('projects.submissions') }}: {{ p.submissions }}
				<a
					v-if="p.submissions"
					:id="`dlr-${p.id}`"
					:href="`/api/submission/export/${$i18n.locale}/${p.id}`"
					target="_blank"
					>{{ $t('projects.export') }}</a
				>
			</ListItem>
		</div>
		<LoadingOverlay :show="loading" />
	</AdminFrame>
</template>

<script>
import ListItem from '../../components/ListItem.vue';
import LoadingOverlay from '../../components/LoadingOverlay.vue';

export default {
	components: {
		ListItem,
		LoadingOverlay,
	},
	middleware: ['auth'],
	async asyncData({ $axios }) {
		const projects = await $axios.$get('/api/projects');
		return { projects };
	},
	data() {
		return {
			filter: '',
			loading: false,
			newProjectTitle: null,
			projects: [],
			filterOwn: false,
		};
	},
	head() {
		return {
			title: `Admin: ${this.$t('projects.title')}`,
		};
	},
	computed: {
		filteredProjects() {
			const projects = this.projects.filter(p => {
				if (p.lang !== this.$i18n.locale) {
					return false;
				}

				const f = this.filter.toLowerCase();
				const t = p.title.toLowerCase();
				const d = (p.description || '').toLowerCase();
				if (this.filterOwn && this.$auth.user.id !== p.userId) {
					return false;
				}
				// eslint-disable-next-line no-unreachable
				return t.includes(f) || d.includes(f);
			});
			projects.sort((a, b) => b.id - a.id);
			return projects;
		},
	},
	mounted() {
		const pid = this.$route.query.dlr;
		if (pid) {
			// remove query param
			this.$router.replace({ path: this.$route.path });

			// start downloading project report
			const a = document.getElementById(`dlr-${pid}`);
			const u = a.getAttribute('href');
			window.location.href = u;
		}
	},
	methods: {
		async add() {
			try {
				const { id } = await this.$axios.$put('/api/project', {
					lang: this.$i18n.locale,
					title: this.newProjectTitle,
					privacyPolicy: `<p>${this.$t('projects.userName')}: ${
						this.$auth.user.name
					}</p><p>E-mail: <a href="mailto:${this.$auth.user.email}">${
						this.$auth.user.email
					}</a></p>`,
					thanks: `<h5>${this.$t(
						'projectEditor.thanksDefault'
					)}</h5>`,
				});
				this.$router.push(this.localePath(`/admin/project/${id}`));
			} catch (error) {
				this.errorToast(this.$t('projects.creationFailed'));
			}
		},
		async clone(project) {
			try {
				this.loading = true;
				await this.$axios.$put('/api/project/clone', {
					id: project.id,
					title: `${project.title} ${new Date().toLocaleString()}`,
				});
				this.projects = await this.$axios.$get('/api/projects');
			} catch (error) {
				this.errorToast(this.$t('projects.creationFailed'));
			} finally {
				this.loading = false;
			}
		},
		async del(project) {
			const confirmed = await this.confirmDeletion(project.title);
			if (confirmed) {
				try {
					this.loading = true;
					await this.$axios.$delete('/api/project/' + project.id);
					this.projects = await this.$axios.$get('/api/projects');
				} catch (error) {
					this.errorToast(this.$t('projects.deletionFailed'));
				} finally {
					this.loading = false;
				}
			}
		},
		filteredOwn(toggle) {
			this.filterOwn = !toggle;
		},
	},
};
</script>
