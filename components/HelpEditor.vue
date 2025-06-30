<script setup lang="ts">
const Stackedit = useNuxtApp().$Stackedit;

const props = defineProps<{
	title: string;
	valueKey: string;
}>();

const { locale, t } = useI18n();

const value = ref('');

onMounted(async () => {
	const record = await $fetch<{ value: string }>(
		`/api/message/${locale.value}/${props.valueKey}`,
	);
	value.value = record.value;
});

function openEditor() {
	const stackedit = new Stackedit();

	// Open the iframe
	stackedit.openFile({
		name: 'Filename', // with an optional filename
		content: {
			text: value.value,
		},
	});

	stackedit.on('fileChange', (file: any) => {
		value.value = file.content.text;
	});
}

const { errorToast, successToast } = useToasts();
async function save() {
	try {
		await $fetch(`/api/message/${locale.value}/${props.valueKey}`, {
			method: 'POST',
			body: {
				value: value.value,
			},
		});
		successToast(t('HelpEditor.saveSuccess'));
	} catch (error) {
		errorToast(t('HelpEditor.saveFailed'));
	}
}
</script>

<template>
	<AdminFrame>
		<template #header>
			<div class="d-flex align-items-center justify-content-between">
				<div>{{ title }}</div>
				<div>
					<button
						class="btn btn-success"
						@click="save"
					>
						{{ $t('SaveButton.save') }}
					</button>
				</div>
			</div>
		</template>

		<p>{{ $t('HelpEditor.instructions') }}</p>

		<b-tabs>
			<b-tab
				:title="$t('HelpEditor.editor')"
				active
			>
				<b-card-text>
					<b-form-textarea
						id="textarea"
						v-model="value"
						autofocus
						class="mb-3 text-monospace"
						rows="5"
						max-rows="12"
					/>
					<div class="d-flex">
						<div class="mb-3 me-3">
							<b-button
								variant="primary"
								@click="openEditor"
							>
								<i class="fas fa-edit" />
							</b-button>
						</div>
						<div>
							<strong>{{ $t('HelpEditor.stackeditButton') }}</strong>
							<br />
							{{ $t('HelpEditor.stackeditInfo') }}
						</div>
					</div>
				</b-card-text>
			</b-tab>
			<b-tab :title="$t('HelpEditor.preview')">
				<Markdown
					class="help mb-5"
					:md="value"
				/>
			</b-tab>
		</b-tabs>
	</AdminFrame>
</template>
