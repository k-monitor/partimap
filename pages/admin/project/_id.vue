<template>
	<AdminFrame>
		<template #header>
			<NuxtLink to="/admin/projects">Projektek</NuxtLink>
			<span class="text-muted">&raquo;</span>
			{{ p.title }}
		</template>

		<form
			id="projectForm"
			@submit.prevent="update"
		>
			<div class="form-group">
				<label for="title">Projekt elnevezése</label>
				<input
					id="title"
					v-model="m.title"
					class="form-control"
					required
					type="text"
				>
			</div>
			<div class="form-group">
				<label for="descriptoin">Leírás</label>
				<textarea
					id="description"
					v-model="m.description"
					class="form-control"
					rows="5"
				/>
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
		</form>

		<template #footer>
			<div class="d-flex justify-content-end">
				<button
					class="btn btn-outline-primary"
					form="projectForm"
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
			const p = await $axios.$get('/api/project/' + params.id);
			return { insts, p, m: { ...p } };
		} catch (err) {
			redirect('/admin/projects');
		}
	},
	head() {
		return {
			title: 'Admin: ' + this.p.title,
		};
	},
	methods: {
		async update() {
			try {
				this.p = await this.$axios.$patch('/api/admin/project', this.m);
				this.m = { ...this.p };
				this.success('Módosítás sikeres');
			} catch (error) {
				this.success('Módosítás sikertelen');
			}
		},
	},
};
</script>
