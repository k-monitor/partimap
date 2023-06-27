<template>
	<b-modal
		:id="id"
		ref="modal"
		:cancel-title="$t('modals.cancel')"
		ok-variant="success"
		:title="$t(`sheetEditor.interactions.${drawType}`)"
		@ok="handleOk"
		@show="reinit"
	>
		<b-form-group
			:label="$t('sheetEditor.instructions')[drawType]"
			:description="`${buttonLabel.length} / 100`"
		>
			<b-form-input
				v-model="buttonLabel"
				:state="buttonLabel.length > 100 ? false : null"
			/>
		</b-form-group>
		<b-form-group :label="$t('sheetEditor.descriptionLabel')">
			<b-form-input
				v-model="descriptionLabel"
				:placeholder="$t('sheetEditor.defaultDescriptionLabel')"
			/>
		</b-form-group>
		<b-form-group :label="$t('sheetEditor.featureLabel')">
			<b-form-input
				v-model="featureLabel"
				:placeholder="$t(`FeatureListElement.defaultName.${drawType}`)"
			/>
		</b-form-group>
	</b-modal>
</template>

<script>
export default {
	props: {
		drawType: {
			type: String,
			default: null,
		},
		id: {
			type: String,
			default: null,
		},
		interactions: {
			type: Object,
			default: null,
		},
	},
	data() {
		return {
			buttonLabel: '',
			descriptionLabel: '',
			featureLabel: '',
		};
	},
	watch: {
		interactions: {
			handler() {
				this.reinit();
			},
			deep: true,
		},
	},
	methods: {
		reinit() {
			this.buttonLabel =
				this.interactions?.buttonLabels[this.drawType] || '';
			this.descriptionLabel =
				this.interactions?.descriptionLabels[this.drawType] || '';
			this.featureLabel =
				this.interactions?.featureLabels[this.drawType] || '';
		},
		handleOk() {
			this.$emit(
				'modified',
				this.drawType,
				this.buttonLabel,
				this.descriptionLabel,
				this.featureLabel
			);
			this.$refs.modal.hide();
		},
	},
};
</script>
