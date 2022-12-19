<template>
	<AdminFrame>
		<template #header>
			{{$t('users.users')}}
		</template>

		<div class="row">
			<div class="col-12 col-md-8">
				<form @submit.prevent="add">
					<div class="input-group mb-3">
						<input
							v-model="newUserEmail"
							class="form-control"
							:placeholder="$t('users.email')"
							required
							type="email"
						>
						<div class="input-group-append">
							<button
								class="btn btn-success"
								type="submit"
							>
								{{$t('users.add')}}
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
						:placeholder="$t('users.filter')"
						type="text"
					>
				</div>
			</div>
		</div>
		<div class="list-group">
			<NuxtLink
				v-for="u in filteredUsers"
				:key="u.id"
				:to="localePath('/admin/user/' + u.id)"
				class="align-items-center list-group-item list-group-item-action"
			>
				<small class="text-muted"> #{{ u.id }} </small>
				<strong>{{ u.name }} &lt;{{ u.email }}&gt;</strong>
				<b-badge
					v-if="u.isAdmin"
					variant="danger"
				>
					Admin
				</b-badge>
				<b-badge
					v-if="!u.active"
					variant="warning"
				>
					{{$t('users.notActive')}}
				</b-badge>
				<br>
				<small class="text-muted">{{$t('users.registered')}}: {{ new Date(u.registered).toLocaleString() }}</small>
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
	head() {
		return {
			title: this.$t('users.adminUsers'),
		};
	},
	computed: {
		filteredUsers() {
			let userById = null;
			const id = Number(this.filter);
			if (id) { userById = this.users.find(u => u.id === id); }
			if (userById) { return [userById]; }
			return this.users.filter(
				u => (
					(u.name || '').toLowerCase().includes(this.filter.toLowerCase()) ||
					u.email.toLowerCase().includes(this.filter.toLowerCase())
				)
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
				this.$router.push(this.localePath('/admin/user/' + id));
			} catch (error) {
				this.errorToast(this.$t('users.createFailed'));
			}
		},
	},
};
</script>
