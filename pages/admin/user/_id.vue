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
			<b-form-group label="Email">
				<b-form-input
					v-model="m.email"
					required
					type="email"
				/>
			</b-form-group>
			<b-form-group label="Név">
				<b-form-input
					v-model="m.name"
					required
				/>
			</b-form-group>
			<b-form-group label="Új jelszó">
				<b-form-input
					v-model="m.newPassword"
					type="password"
				/>
			</b-form-group>
			<b-form-group
				v-if="!$auth.user.isAdmin"
				label="Jelenlegi jelszó (csak email vagy jelszó változtatás esetén szükséges)"
			>
				<b-form-input
					v-model="m.oldPassword"
					:required="m.newPassword || m.email !== u.email"
					type="password"
				/>
			</b-form-group>
			<div v-if="$auth.user.isAdmin">
				<b-form-group>
					<b-form-checkbox
						v-model="m.active"
						class="text-danger"
						:value="1"
						:unchecked-value="0"
					>
						Aktiválva
					</b-form-checkbox>
				</b-form-group>
				<b-form-group>
					<b-form-checkbox
						v-model="m.isAdmin"
						class="text-danger"
						:value="1"
						:unchecked-value="0"
					>
						Adminisztrátor
					</b-form-checkbox>
				</b-form-group>
			</div>
		</form>

		<template #footer>
			<div class="d-flex justify-content-end">
				<button
					class="btn btn-primary"
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
			const u = await $axios.$get('/api/user/' + params.id);
			return { u, m: { ...u, newPassword: null, oldPassword: null } };
		} catch (err) {
			redirect('/admin/users');
		}
	},
	head() {
		return {
			title: 'Admin: ' + (this.u.name || this.u.email),
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
				this.errorToast('Módosítás sikertelen');
			}
		},
	},
};
</script>
