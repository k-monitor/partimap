<template>
	<AdminFrame>
		<template #header>
			<div class="d-flex align-items-center justify-content-between">
				<div>{{ title }}</div>
				<div>
					<b-button
						variant="success"
						@click="save"
						>{{ $t('SaveButton.save') }}</b-button
					>
				</div>
			</div>
		</template>

		<div class="d-flex">
			<div class="mr-3">
				<b-button
					variant="primary"
					@click="openEditor"
				>
					<i class="fas fa-edit" />
				</b-button>
			</div>
			<p>{{ $t('HelpEditor.instructions') }}</p>
		</div>

		<b-form-textarea
			id="textarea"
			v-model="value"
			autofocus
			class="text-monospace"
			rows="3"
			max-rows="12"
		></b-form-textarea>
	</AdminFrame>
</template>

<script>
export default {
	props: {
		title: { type: String, default: '' },
		valueKey: { type: String, default: '' },
	},
	data() {
		return {
			value: '',
		};
	},
	async fetch() {
		const lang = this.$i18n.locale;
		const key = this.valueKey;
		const record = await this.$axios.$get(`/api/i18n/get/${lang}/${key}`);
		this.value = record.value || '';
	},
	methods: {
		openEditor() {
			const stackedit = new this.$Stackedit();

			// Open the iframe
			stackedit.openFile({
				name: 'Filename', // with an optional filename
				content: {
					text: this.value,
				},
			});

			stackedit.on('fileChange', file => {
				this.value = file.content.text;
			});
		},
		async save() {
			try {
				const lang = this.$i18n.locale;
				const key = this.valueKey;
				const value = this.value;
				await this.$axios.$post('/api/i18n/set', {
					lang,
					key,
					value,
				});
				this.success(this.$t('HelpEditor.saveSuccess'));
			} catch (error) {
				this.errorToast(this.$t('HelpEditor.saveFailed'));
			}
		},
	},
};
</script>
