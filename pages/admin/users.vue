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

const { data: users } = await useFetch<User[]>('/api/user/all');

const filter = ref('');
const filteredUsers = computed(() => {
	if (!users.value) return [];
	const term = filter.value || '';

	let userById = null;
	const id = parseInt(term, 10);
	if (id) userById = users.value.find((u) => u.id === id);
	if (userById) return [userById];

	return users.value.filter((u) =>
		`${u.name}|${u.email}`.toLowerCase().includes(term.toLowerCase()),
	);
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
			{{ $t('users.title') }}
		</template>

		<div class="row">
			<div class="col-12 col-md-8">
				<form @submit.prevent="add">
					<div class="input-group mb-3">
						<input
							v-model="newUserEmail"
							class="form-control"
							:placeholder="$t('users.newUsersEmail')"
							required
							type="email"
						/>
						<button
							class="btn btn-success"
							type="submit"
						>
							{{ $t('users.add') }}
						</button>
					</div>
				</form>
			</div>
			<div class="col">
				<div class="form-group mb-3 mx-auto">
					<input
						v-model="filter"
						class="form-control"
						:placeholder="$t('users.filter')"
						type="text"
					/>
				</div>
			</div>
		</div>
		<div class="list-group">
			<NuxtLink
				v-for="u in filteredUsers"
				:key="u.id"
				:to="localePath('/admin/user/' + u.id)"
				class="align-items-center list-group-item list-group-item-action"
			>
				<small class="me-2 text-muted"> #{{ u.id }} </small>
				<strong>{{ u.name }} &lt;{{ u.email }}&gt;</strong>
				<span
					v-if="u.isAdmin"
					class="badge text-bg-danger ms-2"
				>
					{{ $t('users.admin') }}
				</span>
				<span
					v-if="!u.active"
					class="badge text-bg-warning ms-2"
				>
					{{ $t('users.inactive') }}
				</span>
				<br />

				<small class="text-muted">
					{{ $t('users.registered') }}:
					{{ new Date(u.registered).toLocaleString() }}
				</small>
				<br />
				<small class="text-muted">
					{{ $t('users.lastLogin') }}:
					{{ u.lastLogin ? new Date(u.lastLogin).toLocaleString() : '?' }}
				</small>
			</NuxtLink>
		</div>
	</AdminFrame>
</template>
