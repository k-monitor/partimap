<template>
	<AdminFrame>
		<template #header>
			<span v-if="$auth.user.isAdmin">
				<NuxtLink to="/admin/insts">Intézmények</NuxtLink>
				<span class="text-muted">&raquo;</span>
			</span>
			{{ i.name }}
		</template>

		<form
			id="instForm"
			@submit.prevent="update"
		>
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
		</form>

		<template #footer>
			<div class="d-flex">
				<button
					v-if="$auth.user.isAdmin"
					class="btn btn-outline-danger"
					type="button"
					@click="remove"
				>
					Törlés
				</button>
				<button
					class="btn btn-outline-primary ml-auto"
					form="instForm"
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
			const i = await $axios.$get('/api/inst/' + params.id);
			return { i, m: { ...i } };
		} catch (err) {
			redirect('/admin/insts');
		}
	},
	head() {
		return {
			title: 'Admin: ' + this.i.name,
		};
	},
	methods: {
		async update() {
			try {
				this.i = await this.$axios.$patch('/api/inst', this.m);
				this.m = { ...this.i };
				this.success('Módosítás sikeres');
			} catch (error) {
				this.error('Módosítás sikertelen');
			}
		},
		async remove() {
			if (confirm('Biztos?')) {
				try {
					await this.$axios.$delete('/api/admin/inst/' + this.i.id);
					this.$router.push({
						path: '/admin/insts',
					});
				} catch (error) {
					this.error('Törlés sikertelen');
				}
			}
		},
	},
};
</script>
