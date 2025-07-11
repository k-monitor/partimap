<script setup lang="ts">
import type { Sheet } from '~/server/data/sheets';

const sheet = inject<Ref<Sheet | null>>('sheet', ref(null));

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

async function handleMaxDrawChange() {
	await nextTick();
	di.value.max = Math.max(0, di.value.max || 0);
}

const dt = computed(() => di.value.type);
watch(dt, (dt, oldDt) => {
	if (di.value.color !== DEFAULT_COLORS[oldDt]) return;
	di.value.color = DEFAULT_COLORS[dt];
});
</script>

<template>
	<b-modal
		v-model="visible"
		:cancel-title="$t('modals.cancel')"
		no-close-on-backdrop
		:ok-title="$t('SaveButton.save')"
		ok-variant="success"
		:title="di.featureLabel || $t(`sheetEditor.interactions.${di.type}`)"
		@ok="handleOk"
	>
		<b-form-select
			v-model="di.type"
			class="mb-3"
			:options="typeOptions"
		/>

		<b-form-group
			:label="$t('sheetEditor.featureLabel')"
			:description="$t('sheetEditor.featureLabelDescription')"
		>
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

		<div class="row">
			<b-form-group
				class="col-lg-8"
				:label="$t('InteractionSettingsModal.maxDraw')"
			>
				<b-form-input
					v-model.number="di.max"
					min="0"
					type="number"
					@change="handleMaxDrawChange"
				/>
			</b-form-group>
			<b-form-group
				class="col"
				:label="$t('FeatureListElement.color')"
			>
				<b-form-input
					id="type-color"
					v-model="di.color"
					class="w-100"
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
		</div>

		<b-form-group>
			<b-form-checkbox v-model="di.naming">
				{{ $t('sheetEditor.interactions.naming') }}
			</b-form-checkbox>
		</b-form-group>

		<b-form-group>
			<b-form-checkbox v-model="hasFeatureQuestion">
				{{ $t('sheetEditor.addFeatureQuestion') }}
			</b-form-checkbox>
		</b-form-group>
		<div
			v-if="hasFeatureQuestion"
			class="ms-4"
		>
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

		<ShowIfEditor
			v-model="di.showIf"
			:question-index="0"
			:sheet-ord="sheet?.ord || 0"
			:survey="{ questions: [] }"
		/>
	</b-modal>
</template>
