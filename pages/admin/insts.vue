<template>
	<AdminFrame>
		<template #header>
			Intézmények
		</template>

		<div class="row">
			<div class="col-12 col-md-8">
				<form @submit.prevent="add">
					<div class="input-group mb-3">
						<input
							v-model="newInstName"
							class="form-control"
							placeholder="Új intézmény neve"
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
				v-for="i in filteredInsts"
				:key="i.id"
				:to="'/admin/inst/' + i.id"
				class="
							align-items-center
							list-group-item list-group-item-action
						"
			>
				<strong>{{ i.name }}</strong>
				<br>
				TODO: júzerek, partimapok száma
			</NuxtLink>
		</div>
	</AdminFrame>
</template>

<script>
export default {
	middleware: ['auth', 'admin'],
	async asyncData({ $axios }) {
		const insts = await $axios.$get('/api/insts');
		return { insts };
	},
	data() {
		return {
			filter: '',
			insts: [],
			newInstName: null,
		};
	},
	head: {
		title: 'Admin: Intézmények',
	},
	computed: {
		filteredInsts() {
			return this.insts.filter(i =>
				i.name.toLowerCase().includes(this.filter.toLowerCase())
			);
		},
	},
	methods: {
		async add() {
			try {
				await this.$axios.$put('/api/admin/inst', { name: this.newInstName });
				this.insts = await this.$axios.$get('/api/insts');
				this.newInstName = null;
				this.error('Létrehozás sikeres');
			} catch (error) {
				this.error('Létrehozás sikertelen');
			}
		},
	},
};
</script>
