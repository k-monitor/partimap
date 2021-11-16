<template>
	<AdminFrame>
		<template #header>
			Felhasználók
		</template>

		<div class="row">
			<div class="col-12 col-md-8">
				<form @submit.prevent="add">
					<div class="input-group mb-3">
						<input
							v-model="newUserEmail"
							class="form-control"
							placeholder="Új felh. email címe"
							required
							type="email"
						>
						<div class="input-group-append">
							<button
								class="btn btn-success"
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
				v-for="u in filteredUsers"
				:key="u.id"
				:to="'/admin/user/' + u.id"
				class="
							align-items-center
							list-group-item list-group-item-action
						"
			>
				<strong>{{ u.name }} &lt;{{ u.email }}&gt;</strong>
				<span
					v-if="u.isAdmin"
					class="badge badge-danger"
				>ADMIN</span>
			</NuxtLink>
		</div>
	</AdminFrame>
</template>

<script>
export default {
	middleware: ['auth', 'admin'],
	async asyncData({ $axios }) {
		const users = await $axios.$get('/api/users');
		return { users };
	},
	data() {
		return {
			filter: '',
			newUserEmail: null,
			users: [],
		};
	},
	head: {
		title: 'Admin: Felhasználók',
	},
	computed: {
		filteredUsers() {
			return this.users.filter(
				u =>
					(u.name || '').toLowerCase().includes(this.filter.toLowerCase()) ||
					u.email.toLowerCase().includes(this.filter.toLowerCase())
			);
		},
	},
	methods: {
		async add() {
			try {
				const { id } = await this.$axios.$put('/api/user', {
					email: this.newUserEmail,
					name: this.newUserEmail.split('@')[0],
				});
				this.$router.push({ path: '/admin/user/' + id });
			} catch (error) {
				this.errorToast('Létrehozás sikertelen');
			}
		},
	},
};
</script>
