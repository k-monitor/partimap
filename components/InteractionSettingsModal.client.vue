<script setup lang="ts">
const visible = defineModel<boolean>();

const props = defineProps<{
	drawType: DrawType;
	interactions: Interactions;
}>();
const drawType = toRef(props, 'drawType');
const interactions = toRef(props, 'interactions');

const buttonLabel = ref('');
const descriptionLabel = ref('');
const hasFeatureQuestion = ref(false);
const featureLabel = ref('');
const featureQuestion = ref<Record<string, any>>({});
// TODO would be nice to use Question here, but id field type is string here

function reinit() {
	buttonLabel.value = interactions.value.buttonLabels[drawType.value] || buttonLabel.value;
	descriptionLabel.value =
		interactions.value.descriptionLabels[drawType.value] || descriptionLabel.value;
	featureLabel.value = interactions.value.featureLabels[drawType.value] || featureLabel.value;
	featureQuestion.value =
		interactions.value.featureQuestions[drawType.value] || featureQuestion.value;
	hasFeatureQuestion.value = !!interactions.value.featureQuestions[drawType.value]?.label;
}
watch(interactions, reinit, { deep: true });

const emit = defineEmits<{
	(
		e: 'modified',
		drawType: DrawType,
		buttonLabel: string,
		descriptionLabel: string,
		featureLabel: string,
		featureQuestion: Record<string, string>,
	): void;
}>();

function handleOk() {
	if (hasFeatureQuestion.value && featureQuestion.value.label) {
		featureQuestion.value.id = 'partimapFeatureQuestion';
		featureQuestion.value.type = 'checkbox';
	} else {
		featureQuestion.value = {};
	}
	emit(
		'modified',
		drawType.value,
		buttonLabel.value,
		descriptionLabel.value,
		featureLabel.value,
		featureQuestion.value,
	);
	visible.value = false;
}

function inputValid(max: number) {
	if (
		!featureQuestion.value.options ||
		!max ||
		max < 1 ||
		max >= featureQuestion.value.options.length
	) {
		featureQuestion.value.max = '';
	}
}
</script>

<template>
	<b-modal
		v-model="visible"
		:cancel-title="$t('modals.cancel')"
		ok-variant="success"
		:teleport-disabled="true"
		teleport-to="body"
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
			:label="$t(`sheetEditor.instructions.${drawType}`)"
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
					:max="!featureQuestion.options ? 0 : featureQuestion.options.length"
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
