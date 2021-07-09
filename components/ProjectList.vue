<template>
	<div>
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
			<NuxtLink
				v-for="p in filteredProjects"
				:key="p.id"
				:to="'/' + prefix + '/project/' + p.id"
				class="
								align-items-center
								list-group-item list-group-item-action
							"
			>
				<strong>{{ p.title }}</strong>
				<br>
				TODO: intézmény neve
			</NuxtLink>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		prefix: {
			type: String,
			default: 'my',
		},
	},
	data() {
		return {
			filter: '',
			newProjectTitle: null,
			projects: [],
		};
	},
	async fetch() {
		const { $axios } = this.$nuxt.context;
		this.projects = await $axios.$get(`/api/${this.prefix}/projects`);
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
				const { id } = await this.$axios.$put(`/api/${this.prefix}/project`, {
					title: this.newProjectTitle,
				});
				this.$router.push({ path: `/${this.prefix}/project/${id}` });
			} catch (error) {
				this.error('Létrehozás sikertelen');
			}
		},
	},
};
</script>
