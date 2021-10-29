<template>
	<AdminFrame>
		<template #header>
			Térképek
		</template>

		<div class="row">
			<div class="col-12 col-md-8">
				<form @submit.prevent="add">
					<div class="input-group mb-3">
						<input
							v-model="newMapTitle"
							class="form-control"
							placeholder="Új térkép elnevezése"
							required
							type="text"
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
			<div
				v-for="m in filteredMaps"
				:key="m.id"
				class="align-items-center d-flex list-group-item"
			>
				<NuxtLink
					:to="'/admin/map/' + m.id"
					class="font-weight-bold mr-2"
				>
					{{ m.title }}
				</NuxtLink>
				<span
					v-if="m.userId != $auth.user.id"
					class="badge badge-warning"
				>
					Tulajdonos: #{{ m.userId }}
				</span>
				<span
					v-else-if="$auth.user.isAdmin"
					class="badge badge-info"
				>
					Saját
				</span>
				<span
					class="ml-auto text-danger"
					role="button"
					@click.prevent="del(m)"
				>
					<i class="fas fa-trash" />
				</span>
			</div>
		</div>
	</AdminFrame>
</template>

<script>
export default {
	middleware: ['auth'],
	async asyncData({ $axios }) {
		const maps = await $axios.$get('/api/maps');
		return { maps };
	},
	data() {
		return {
			filter: '',
			newMapTitle: null,
			maps: [],
		};
	},
	head: {
		title: 'Admin: Térképek',
	},
	computed: {
		filteredMaps() {
			return this.maps.filter(
				m =>
					m.title.toLowerCase().includes(this.filter.toLowerCase()) ||
					(m.description || '')
						.toLowerCase()
						.includes(this.filter.toLowerCase())
			);
		},
	},
	methods: {
		async add() {
			try {
				const { id } = await this.$axios.$put('/api/map', {
					title: this.newMapTitle,
				});
				this.$router.push({ path: `/admin/map/${id}` });
			} catch (error) {
				this.errorToast('Létrehozás sikertelen');
			}
		},
		async del(map) {
			const confirmed = await this.confirmDeletion(map.title);
			if (confirmed) {
				try {
					await this.$axios.$delete('/api/map/' + map.id);
					this.maps = await this.$axios.$get('/api/maps');
				} catch (error) {
					this.errorToast('Sikertelen törlés.');
				}
			}
		},
	},
};
</script>
