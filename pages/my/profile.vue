<template>
	<AdminFrame>
		<template #header>
			Adataim
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
					required
					class="form-control"
					type="email"
				>
			</div>
			<div class="form-group">
				<label for="name">Név</label>
				<input
					id="name"
					v-model="m.name"
					required
					class="form-control"
					type="text"
				>
			</div>
			<div class="form-group">
				<label for="inst">Intézmény</label>
				<select
					class="form-control"
					disabled
				>
					<option>{{ i.name || '(Nincs)' }}</option>
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
			<div class="form-group">
				<label for="oldPassword">Jelenlegi jelszó (csak email vagy jelszó változtatás esetén szükséges)</label>
				<input
					id="oldPassword"
					v-model="m.oldPassword"
					:required="m.newPassword || m.email !== u.email"
					class="form-control"
					type="password"
				>
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
	async asyncData({ $axios }) {
		const u = await $axios.$get('/api/my/profile');
		const i = await $axios.$get('/api/my/inst');
		return { i, u, m: { ...u, newPassword: null, oldPassword: null } };
	},
	head() {
		return {
			title: 'Adataim',
		};
	},
	methods: {
		async update() {
			try {
				this.u = await this.$axios.$patch('/api/my/profile', this.m);
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
