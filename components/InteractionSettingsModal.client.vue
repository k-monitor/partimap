<script setup lang="ts">
const visible = defineModel<boolean>();

const props = defineProps<{
	drawingInteraction: DrawingInteraction;
}>();
const di = ref(props.drawingInteraction);

const hasFeatureQuestion = ref(!!di.value?.featureQuestion.label);

const emit = defineEmits<{
	(e: 'modified', di: DrawingInteraction): void;
}>();

function handleOk() {
	if (hasFeatureQuestion.value && di.value.featureQuestion.label) {
		di.value.featureQuestion.id = 'partimapFeatureQuestion';
		di.value.featureQuestion.type = 'checkbox';
	} else {
		di.value.featureQuestion = {};
	}
	emit('modified', di.value);
	visible.value = false;
}

function inputValid(max: number) {
	if (
		!di.value.featureQuestion.options ||
		!max ||
		max < 1 ||
		max >= di.value.featureQuestion.options.length
	) {
		delete di.value.featureQuestion.max;
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
		:title="di.featureLabel"
		@ok="handleOk"
	>
		<div class="bg-warning">{{ di }}</div>
		<b-form-group :label="$t('sheetEditor.featureLabel')">
			<b-form-input
				v-model="di.featureLabel"
				:placeholder="$t(`FeatureListElement.defaultName.${di.type}`)"
			/>
		</b-form-group>
		<b-form-group
			:label="$t(`sheetEditor.instructions.${di.type}`)"
			:description="`${(di.buttonLabel || '').length} / 100`"
		>
			<b-form-input
				v-model="di.buttonLabel"
				:state="(di.buttonLabel || '').length > 100 ? false : null"
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
				<b-form-input v-model="di.featureQuestion.label" />
			</b-form-group>
			<OptionsEditor
				v-model="di.featureQuestion.options"
				label-state="option"
			/>
			<b-form-group :label="$t('SurveyEditor.maxSelect')">
				<b-form-input
					v-model.number="di.featureQuestion.max"
					type="number"
					min="1"
					:max="!di.featureQuestion.options ? 0 : di.featureQuestion.options.length"
					@change="inputValid"
				/>
			</b-form-group>
			<b-form-group>
				<b-form-checkbox v-model="di.featureQuestion.other">
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
				v-model="di.descriptionLabel"
				:placeholder="$t('sheetEditor.defaultDescriptionLabel')"
			/>
		</b-form-group>
	</b-modal>
</template>
