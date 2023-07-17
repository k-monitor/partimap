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
		<b-form-group :label="$t('sheetEditor.featureLabel')">
			<b-form-input
				v-model="featureLabel"
				:placeholder="$t(`FeatureListElement.defaultName.${drawType}`)"
			/>
		</b-form-group>
		<b-form-group
			:label="$t('sheetEditor.instructions')[drawType]"
			:description="`${buttonLabel.length} / 100`"
		>
			<b-form-input
				v-model="buttonLabel"
				:state="buttonLabel.length > 100 ? false : null"
			/>
		</b-form-group>

		<hr />

		<b-form-group>
			<b-form-checkbox v-model="hasFeatureQuestion">
				{{ $t('sheetEditor.addFeatureQuestion') }}
			</b-form-checkbox>
		</b-form-group>
		<div v-if="hasFeatureQuestion">
			<b-form-group :label="$t('SurveyEditor.questionText')">
				<b-form-input v-model="featureQuestion.label" />
			</b-form-group>
			<OptionsEditor
				v-model="featureQuestion.options"
				label-state="option"
			/>
			<b-form-group :label="$t('SurveyEditor.maxSelect')">
				<b-form-input
					v-model.number="featureQuestion.max"
					type="number"
					min="1"
					:max="
						!featureQuestion.options
							? 0
							: featureQuestion.options.length
					"
					@change="inputValid"
				/>
			</b-form-group>
			<b-form-group>
				<b-form-checkbox v-model="featureQuestion.other">
					{{ $t('SurveyEditor.other') }}
				</b-form-checkbox>
			</b-form-group>
			<!-- TODO use SurveyEditor instead of these copied parts -->
		</div>

		<hr />

		<b-form-group
			:label="$t('sheetEditor.descriptionLabel')"
			:description="$t('sheetEditor.descriptionLabelDescription')"
		>
			<b-form-input
				v-model="descriptionLabel"
				:placeholder="$t('sheetEditor.defaultDescriptionLabel')"
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
			hasFeatureQuestion:
				!!this.interactions?.featureQuestions[this.drawType]?.label,
			featureLabel: '',
			featureQuestion: {},
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
			this.featureQuestion =
				this.interactions?.featureQuestions[this.drawType] || {};
			// this.hasFeatureQuestion =
			//	!!this.interactions?.featureQuestions[this.drawType]?.label;
		},
		handleOk() {
			if (this.hasFeatureQuestion && this.featureQuestion.label) {
				this.featureQuestion.id = 'partimapFeatureQuestion';
				this.featureQuestion.type = 'checkbox';
			} else {
				this.featureQuestion = {};
			}
			this.$emit(
				'modified',
				this.drawType,
				this.buttonLabel,
				this.descriptionLabel,
				this.featureLabel,
				this.featureQuestion
			);
			this.$refs.modal.hide();
		},
	},
};
</script>
