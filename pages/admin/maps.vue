<script setup lang="ts">
import type { Map } from '~/server/data/maps';

const { t } = useI18n();
const localePath = useLocalePath();

useHead({
	title: `Admin: ${t('maps.title')}`,
});

const { data: maps, refresh } = await useFetch<Map[]>('/api/map/all');

const filter = ref('');
const loading = ref(false);
const newMapTitle = ref(null);
const filterOwn = ref(false);

const { user } = useAuth();

const filteredMaps = computed(() => {
	const f = filter.value.toLowerCase();
	return (maps.value || [])
		.filter((m) => {
			if (filterOwn.value && user.value?.id !== m.userId) {
				return false;
			}
			return m.title.toLowerCase().includes(f);
		})
		.sort((a, b) => b.id - a.id);
});

const { errorToast } = useToasts();

async function add() {
	try {
		const { id } = await $fetch<{ id: number }>('/api/map', {
			method: 'PUT',
			body: {
				title: newMapTitle.value,
			},
		});
		navigateTo(localePath(`/admin/map/${id}`));
	} catch (error) {
		errorToast(t('maps.creationFailed'));
	}
}

async function clone(map: Map) {
	try {
		loading.value = true;
		await $fetch('/api/map/clone', {
			method: 'POST',
			body: {
				id: map.id,
				title: `${map.title} ${new Date().toLocaleString()}`,
			},
		});
		await refresh();
	} catch (error) {
		errorToast(t('maps.creationFailed'));
	} finally {
		loading.value = false;
	}
}

const { confirmDeletion } = useConfirmation();
async function del(map: Map) {
	const confirmed = await confirmDeletion(map.title);
	if (!confirmed) return;
	try {
		loading.value = true;
		await $fetch(`/api/map/${map.id}`, { method: 'DELETE' });
		await refresh();
	} catch (error) {
		errorToast(t('maps.deleteFailed'));
	} finally {
		loading.value = false;
	}
}
</script>

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
				v-if="user?.isAdmin"
				class="col col-mr-0"
			>
				<input
					class="btn btn-outline-primary form-control"
					:class="{ active: filterOwn }"
					type="button"
					:value="$t('maps.ownMaps')"
					@click="filterOwn = !filterOwn"
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
				@clone="clone(m)"
				@del="del(m)"
			/>
		</div>
		<LoadingOverlay :show="loading" />
	</AdminFrame>
</template>
