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
						/>
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
					/>
				</div>
			</div>
			<div
				v-if="$auth.user.isAdmin"
				class="col col-mr-0"
			>
				<input
					class="btn btn-outline-primary form-control"
					:class="{ active: filterOwn }"
					type="button"
					:value="$t('maps.ownMaps')"
					@click="filteredOwn(filterOwn)"
				/>
			</div>
		</div>
		<div class="list-group">
			<ListItem
				v-for="m in filteredMaps"
				:key="m.id"
				:link="localePath('/admin/map/' + m.id)"
				:title="m.title"
				:user-id="m.userId"
				@del="del(m)"
			/>
		</div>
		<LoadingOverlay :show="loading" />
	</AdminFrame>
</template>

<script>
import ListItem from '../../components/ListItem.vue';
import LoadingOverlay from '../../components/LoadingOverlay.vue';

export default {
	components: {
		ListItem,
		LoadingOverlay,
	},
	middleware: ['auth'],
	async asyncData({ $axios }) {
		const maps = await $axios.$get('/api/maps');
		return { maps };
	},
	data() {
		return {
			filter: '',
			loading: false,
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
			return this.maps.filter(m => {
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
					this.loading = true;
					await this.$axios.$delete('/api/map/' + map.id);
					this.maps = await this.$axios.$get('/api/maps');
				} catch (error) {
					this.errorToast(this.$t('maps.deleteFailed'));
				} finally {
					this.loading = false;
				}
			}
		},
		filteredOwn(toggle) {
			this.filterOwn = !toggle;
		},
	},
};
</script>
