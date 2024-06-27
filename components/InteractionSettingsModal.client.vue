<script setup lang="ts">
const visible = defineModel<boolean>();

const props = defineProps<{
	drawingInteraction: DrawingInteraction;
}>();
const di = ref(props.drawingInteraction);

const { t } = useI18n();

const typeOptions = DRAW_TYPES.map((dt) => ({
	value: dt,
	text: t(`sheetEditor.interactions.${dt}`),
}));

const hasFeatureQuestion = ref(!!di.value?.featureQuestion.label);

const emit = defineEmits<{
	(e: 'modified', di: DrawingInteraction): void;
}>();

function handleOk() {
	if (hasFeatureQuestion.value && di.value.featureQuestion.label) {
		di.value.featureQuestion.id = 'partimapFeatureQuestion'; // TODO fix type
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
		:title="di.featureLabel || $t(`sheetEditor.interactions.${di.type}`)"
		@ok="handleOk"
	>
		<b-form-select
			v-model="di.type"
			class="mb-3"
			:options="typeOptions"
		/>

		<b-form-group :label="$t('FeatureListElement.color')">
			<b-form-input
				id="type-color"
				v-model="di.color"
				class="w-100"
				size="sm"
				type="color"
				list="presetColors"
			/>
			<datalist id="presetColors">
				<option
					v-for="c in COLOR_PALETTE"
					:key="c"
				>
					{{ c }}
				</option>
			</datalist>
		</b-form-group>

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

		<b-form-group>
			<b-form-checkbox v-model="di.describing">
				{{ $t('sheetEditor.interactions.describing') }}
			</b-form-checkbox>
		</b-form-group>
		<b-form-group
			v-if="di.describing"
			class="ms-4"
			:label="$t('sheetEditor.descriptionLabel')"
			:description="$t('sheetEditor.descriptionLabelDescription')"
		>
			<b-form-input
				v-model="di.descriptionLabel"
				:placeholder="$t('sheetEditor.defaultDescriptionLabel')"
			/>
		</b-form-group>

		<b-form-group>
			<b-form-checkbox v-model="di.naming">
				{{ $t('sheetEditor.interactions.naming') }}
			</b-form-checkbox>
		</b-form-group>
	</b-modal>
</template>
