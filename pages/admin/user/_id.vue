<template>
	<AdminFrame>
		<template #header>
			<span v-if="$auth.user.isAdmin">
				<NuxtLink to="/admin/users">Felhasználók</NuxtLink>
				<span class="text-muted">&raquo;</span>
			</span>
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
					:disabled="!$auth.user.isAdmin"
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
			<div
				v-if="!$auth.user.isAdmin"
				class="form-group"
			>
				<label for="oldPassword">Jelenlegi jelszó (csak email vagy jelszó változtatás esetén szükséges)</label>
				<input
					id="oldPassword"
					v-model="m.oldPassword"
					:required="m.newPassword || m.email !== u.email"
					class="form-control"
					type="password"
				>
			</div>
			<div
				v-if="$auth.user.isAdmin"
				class="form-check mt-5"
			>
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
	middleware: ['auth'],
	async asyncData({ $axios, params, redirect }) {
		try {
			const insts = await $axios.$get('/api/insts');
			const u = await $axios.$get('/api/user/' + params.id);
			return { insts, u, m: { ...u, newPassword: null, oldPassword: null } };
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
				this.u = await this.$axios.$patch('/api/user', this.m);
				this.m = { ...this.u, newPassword: null, oldPassword: null };
				this.$auth.fetchUser();
				this.success('Módosítás sikeres');
			} catch (error) {
				this.error('Módosítás sikertelen');
			}
		},
	},
};
</script>
