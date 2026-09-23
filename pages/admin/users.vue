<script setup lang="ts">
import useToasts from '~/composables/useToasts';
import type { User } from '~/server/data/users';

definePageMeta({
	middleware: ['admin'],
});

const { locale, t } = useI18n();
const localePath = useLocalePath();

useHead({
	title: `Admin: ${t('users.title')}`,
});

const filter = ref('');
const page = ref(1);

const { data, pending: listPending } = await useFetch<{
	users: User[];
	total: number;
	pageSize: number;
}>('/api/user/all', { query: { filter, page } });

const users = computed(() => data.value?.users ?? []);
const total = computed(() => data.value?.total ?? 0);
const pageSize = computed(() => data.value?.pageSize ?? 1);
const pageCount = computed(() => Math.ceil(total.value / pageSize.value));

watch(filter, () => {
	page.value = 1;
});

const newUserEmail = ref('');
const { errorToast } = useToasts();
async function add() {
	try {
		const { id } = await $fetch<User>('/api/user/register', {
			method: 'POST',
			body: {
				email: newUserEmail.value,
				locale: locale.value,
				name: newUserEmail.value.split('@')[0],
			},
		});
		navigateTo(localePath(`/admin/user/${id}`));
	} catch (error) {
		errorToast(t('users.creationFailed'));
	}
}
</script>

<template>
	<AdminFrame>
		<template #header>
			{{ t('users.title') }}
		</template>

		<div class="row">
			<div class="col-12 col-md-8">
				<form @submit.prevent="add">
					<div class="input-group mb-3">
						<input
							v-model="newUserEmail"
							class="form-control"
							:placeholder="t('users.newUsersEmail')"
							required
							type="email"
						/>
						<button
							class="btn btn-success"
							type="submit"
						>
							{{ t('users.add') }}
						</button>
					</div>
				</form>
			</div>
			<div class="col">
				<div class="form-group mb-3 mx-auto">
					<input
						v-model="filter"
						class="form-control"
						:placeholder="t('users.filter')"
						type="text"
					/>
				</div>
			</div>
		</div>
		<div class="list-group">
			<NuxtLink
				v-for="u in users"
				:key="u.id"
				:to="localePath('/admin/user/' + u.id)"
				class="align-items-center list-group-item list-group-item-action"
			>
				<small class="me-2 text-muted"> #{{ u.id }} </small>
				<strong>{{ u.email }}</strong>
				<span
					v-if="u.isAdmin"
					class="badge text-bg-danger ms-2"
				>
					{{ t('users.admin') }}
				</span>
				<span
					v-if="!u.active"
					class="badge text-bg-warning ms-2"
				>
					{{ t('users.inactive') }}
				</span>
				<br />

				<small class="text-muted">
					{{ t('users.registered') }}:
					{{ new Date(u.registered).toLocaleString() }}
				</small>
				<br />
				<small class="text-muted">
					{{ t('users.lastLogin') }}:
					{{ u.lastLogin ? new Date(u.lastLogin).toLocaleString() : '?' }}
				</small>
			</NuxtLink>
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
		<LoadingOverlay :show="listPending" />
	</AdminFrame>
</template>
