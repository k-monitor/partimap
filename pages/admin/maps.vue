<template>
	<AdminFrame>
		<template #header>
			{{ $t('maps.title') }}
		</template>

		<div class="row">
			<div class="col-12 col-md-7">
				<form @submit.prevent="add">
					<div class="input-group mb-3">
						<input
							v-model="newMapTitle"
							class="form-control"
							:placeholder="$t('maps.newMapsName')"
							required
							type="text"
						>
						<div class="input-group-append">
							<button
								class="btn btn-success"
								type="submit"
							>
								{{ $t('maps.add') }}
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
						:placeholder="$t('maps.filter')"
						type="text"
					>
				</div>
			</div>
			<div v-if="$auth.user.isAdmin" class="col col-mr-0">
				<input
					class="btn btn-outline-primary form-control"
					:class="{active: filterOwn}"
					type="button"
					:value="$t('maps.ownMaps')"
					@click="filteredOwn(filterOwn)"
				>
			</div>
		</div>
		<div class="list-group">
			<div
				v-for="m in filteredMaps"
				:key="m.id"
				class="align-items-center d-flex list-group-item"
			>
				<NuxtLink
					:to="localePath('/admin/map/' + m.id)"
					class="font-weight-bold mr-2"
				>
					{{ m.title }}
				</NuxtLink>
				<span
					v-if="m.userId != $auth.user.id"
					class="badge badge-warning"
				>
					{{ $t('maps.owner') }} #{{ m.userId }}
				</span>
				<span
					v-else-if="$auth.user.isAdmin"
					class="badge badge-info"
				>
					{{ $t('maps.own') }}
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
			filterOwn: false,
		};
	},
	head() {
		return {
			title: `Admin: ${this.$t('maps.title')}`,
		};
	},
	computed: {
		filteredMaps() {
			return this.maps.filter(
				m => {
					const f = this.filter.toLowerCase();
					const t = m.title.toLowerCase();
					const d = (m.description || '').toLowerCase();
					if (this.filterOwn && this.$auth.user.id !== m.userId) {
						return false;
					}
					// eslint-disable-next-line no-unreachable
					return t.includes(f) || d.includes(f);
				});
		},
	},
	methods: {
		async add() {
			try {
				const { id } = await this.$axios.$put('/api/map', {
					title: this.newMapTitle,
				});
				this.$router.push(this.localePath(`/admin/map/${id}`));
			} catch (error) {
				this.errorToast(this.$t('maps.creationFailed'));
			}
		},
		async del(map) {
			const confirmed = await this.confirmDeletion(map.title);
			if (confirmed) {
				try {
					await this.$axios.$delete('/api/map/' + map.id);
					this.maps = await this.$axios.$get('/api/maps');
				} catch (error) {
					this.errorToast(this.$t('maps.deleteFailed'));
				}
			}
		},
		filteredOwn(toggle) {
			this.filterOwn = !toggle;
		},
	},
};
</script>
