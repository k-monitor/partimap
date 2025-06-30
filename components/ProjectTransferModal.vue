<script setup lang="ts">
import type { Project } from '~/server/data/projects';

const visible = defineModel<boolean>();
const props = defineProps<{
	project: Project | null;
}>();

const emits = defineEmits<{
	(e: 'transferred'): void;
}>();

const { t } = useI18n();
const confirm = ref(false);
const email = ref('');
const form = ref<HTMLFormElement>();

watch(visible, (v) => {
	if (v) {
		email.value = '';
		confirm.value = false;
	}
});

const { errorToast, successToast } = useToasts();

async function transfer() {
	if (!props.project || !form.value?.reportValidity() || !confirm.value) return;
	const { id } = props.project;
	try {
		await $fetch(`/api/project/${id}/transfer`, {
			method: 'POST',
			body: {
				email: email.value,
			},
		});
		successToast(t('ProjectTransferModal.success'));
		emits('transferred');
		visible.value = false;
	} catch (error) {
		errorToast(t('ProjectTransferModal.failure'));
	}
}
</script>

<template>
	<b-modal
		v-model="visible"
		:cancel-title="$t('modals.cancel')"
		no-close-on-backdrop
		:ok-disabled="!confirm || !email"
		:ok-title="$t('ProjectTransferModal.ok')"
		ok-variant="success"
		:title="$t('ListItem.transfer') + ': ' + project?.title"
		@ok.prevent="transfer"
	>
		<form
			ref="form"
			@submit.prevent="transfer"
		>
			<form-group :label="$t('ProjectTransferModal.email')">
				<b-form-input
					v-model="email"
					type="email"
					required
				/>
			</form-group>
			<b-form-group>
				<b-form-checkbox
					v-model="confirm"
					required
				>
					{{ $t('ProjectTransferModal.confirm') }}
				</b-form-checkbox>
			</b-form-group>
		</form>
	</b-modal>
</template>
