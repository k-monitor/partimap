<script setup lang="ts">
import type { Map } from '~/server/data/maps';

const { t } = useI18n();
const localePath = useLocalePath();

useHead({
	title: `Admin: ${t('maps.title')}`,
});

const { user } = useAuth();

const filter = ref('');
const page = ref(1);
const filterOwn = ref(true);
const loading = ref(false);
const newMapTitle = ref(null);

const {
	data,
	pending: listPending,
	refresh,
} = await useFetch<{ maps: Map[]; total: number; pageSize: number }>('/api/map/all', {
	query: { filter, page, filterOwn },
});

const maps = computed(() => data.value?.maps ?? []);
const total = computed(() => data.value?.total ?? 0);
const pageSize = computed(() => data.value?.pageSize ?? 1);
const pageCount = computed(() => Math.ceil(total.value / pageSize.value));

watch([filter, filterOwn], () => {
	page.value = 1;
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
			{{ t('maps.title') }}
		</template>

		<div class="row">
			<div class="col-12 col-md-6">
				<form @submit.prevent="add">
					<div class="input-group mb-3">
						<input
							v-model="newMapTitle"
							class="form-control"
							:placeholder="t('maps.newMapsName')"
							required
							type="text"
						/>
						<button
							class="btn btn-success"
							type="submit"
						>
							{{ t('maps.add') }}
						</button>
					</div>
				</form>
			</div>
			<div class="col">
				<div class="form-group mb-3 mx-auto">
					<input
						v-model="filter"
						class="form-control"
						:placeholder="t('maps.filter')"
						type="text"
					/>
				</div>
			</div>
			<div
				v-if="user?.isAdmin"
				class="col d-flex align-items-center mb-3"
			>
				<BFormCheckbox
					v-model="filterOwn"
					class="text-nowrap"
					switch
				>
					{{ t('maps.ownMaps') }}
				</BFormCheckbox>
			</div>
		</div>
		<div class="list-group">
			<ListItem
				v-for="m in maps"
				:key="m.id"
				:link="localePath('/admin/map/' + m.id)"
				:title="m.title"
				:user-id="m.userId"
				@clone="clone(m)"
				@del="del(m)"
			/>
		</div>
		<nav
			v-if="pageCount > 1"
			class="mt-3"
		>
			<ul class="pagination justify-content-center">
				<li
					class="page-item"
					:class="{ disabled: page <= 1 }"
				>
					<button
						class="page-link"
						@click="page--"
					>
						&laquo;
					</button>
				</li>
				<li
					v-for="p in pageCount"
					:key="p"
					class="page-item"
					:class="{ active: p === page }"
				>
					<button
						class="page-link"
						@click="page = p"
					>
						{{ p }}
					</button>
				</li>
				<li
					class="page-item"
					:class="{ disabled: page >= pageCount }"
				>
					<button
						class="page-link"
						@click="page++"
					>
						&raquo;
					</button>
				</li>
			</ul>
		</nav>
		<LoadingOverlay :show="loading || listPending" />
	</AdminFrame>
</template>
