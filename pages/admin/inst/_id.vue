<template>
	<AdminFrame>
		<template #header>
			<NuxtLink to="/admin/insts">Intézmények</NuxtLink>
			<span class="text-muted">&raquo;</span>
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
					type="text"
				>
			</div>
		</form>

		<template #footer>
			<div class="d-flex justify-content-between">
				<button
					class="btn btn-outline-danger"
					type="button"
					@click="remove"
				>
					Törlés
				</button>
				<button
					class="btn btn-outline-primary"
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
			await this.$axios.$patch('/api/admin/inst', this.m);
			this.i = await this.$axios.$get('/api/inst/' + this.i.id);
			this.m = { ...this.i };
			// TODO display success/error
		},
		async remove() {
			if (confirm('Biztos?')) {
				await this.$axios.$delete('/api/admin/inst/' + this.i.id);
				this.$router.push({
					path: '/admin/insts',
				});
			}
		},
	},
};
</script>
