<template>
	<AdminFrame>
		<template #header>
			<NuxtLink to="/admin/users">Felhasználók</NuxtLink>
			<span class="text-muted">&raquo;</span>
			{{ u.email }}
		</template>

		<form
			id="userForm"
			@submit.prevent="update"
		>
			<div class="form-group">
				<label for="email">Email</label>
				<input
					id="email"
					v-model="m.email"
					class="form-control"
					required
					type="email"
				>
			</div>
			<div class="form-group">
				<label for="name">Név</label>
				<input
					id="name"
					v-model="m.name"
					class="form-control"
					required
					type="text"
				>
			</div>
			<div class="form-group">
				<label for="inst">Intézmény</label>
				<select
					id="inst"
					v-model="m.instId"
					class="form-control"
				>
					<option :value="null">(Nincs)</option>
					<option
						v-for="i in insts"
						:key="i.id"
						:value="i.id"
					>
						{{ i. name }}
					</option>
				</select>
			</div>
			<div class="form-group">
				<label for="newPassword">Új jelszó</label>
				<input
					id="newPassword"
					v-model="m.newPassword"
					class="form-control"
					type="password"
				>
			</div>
			<div class="form-check mt-5">
				<input
					id="isAdmin"
					v-model="m.isAdmin"
					class="form-check-input"
					type="checkbox"
				>
				<label
					class="form-check-label text-danger"
					for="isAdmin"
				>
					Adminisztrátor
				</label>
			</div>
		</form>

		<template #footer>
			<div class="d-flex justify-content-end">
				<button
					class="btn btn-outline-primary"
					form="userForm"
					type="submit"
				>
					Mentés
				</button>
			</div>
		</template>
	</AdminFrame>
</template>

<script>
export default {
	middleware: ['auth', 'admin'],
	async asyncData({ $axios, params, redirect }) {
		try {
			const insts = await $axios.$get('/api/insts');
			const u = await $axios.$get('/api/admin/user/' + params.id);
			return { insts, u, m: { ...u, newPassword: null } };
		} catch (err) {
			redirect('/admin/users');
		}
	},
	head() {
		return {
			title: 'Admin: ' + this.u.email,
		};
	},
	methods: {
		async update() {
			try {
				this.u = await this.$axios.$patch('/api/admin/user', this.m);
				this.m = { ...this.u, newPassword: null };
				this.$auth.fetchUser();
				this.success('Módosítás sikeres');
			} catch (error) {
				this.error('Módosítás sikertelen');
			}
		},
	},
};
</script>
