<script setup lang="ts">
import type { User } from '~/server/data/users';

const { user } = useAuth();
const { data: u } = await useFetch<User>('/api/user/' + user.value.id);
const { t } = useI18n();

const modalVisible = ref(false);

onMounted(async () => {
	if (!u.value?.consent25Aug) {
		modalVisible.value = true;
	}
});

const { errorToast } = useToasts();

async function handleOk() {
	try {
		await $fetch<User>(`/api/user/${user.value?.id}`, {
			method: 'PATCH',
			body: { consent25Aug: 1 },
		});
		modalVisible.value = false;
	} catch (_error: unknown) {
		errorToast(t('userEditor.changeFailed'));
	}
}
</script>

<template>
	<b-modal
		v-model="modalVisible"
		ok-only
		scrollable
		size="lg"
		:title="$t('register.termsTitle')"
		@ok="handleOk"
	>
		<Terms />
	</b-modal>
</template>
