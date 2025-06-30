<script setup lang="ts">
import type { BvTriggerableEvent } from 'bootstrap-vue-next';
import type { Map } from '~/server/data/maps';
import type { Sheet } from '~/server/data/sheets';

const visible = defineModel<boolean>();

const props = defineProps<{
	projectId: number;
}>();

const emit = defineEmits<{
	(e: 'addedSheet', sheet: Sheet): void;
}>();

const { t } = useI18n();

const maps = ref<Map[]>([]);
const mapOptions = computed(() => {
	const options = [
		{
			value: null,
			text: t('ProjectSheetManager.withoutCopying'),
		},
		...(maps.value || []).map((map) => {
			const featureCount = safeParseJSONArray(map.features).length;
			return {
				value: map.id,
				text: `${map.title} (${featureCount})`,
			};
		}),
	];
	return options;
});

watch(visible, async (v) => {
	if (!v) return;
	maps.value = await $fetch<Map[]>('/api/map/all?onlyFeatureCounts=1');
});

const form = ref<HTMLFormElement>();
const title = ref('');
const titleInput = ref<HTMLInputElement>();
const titleState = ref<boolean | null>(null);
const type = ref('text');
const sourceMap = ref<number | null>(0);

const sheetTypes = computed(() => {
	return SHEET_TYPES.map((st) => ({
		...st,
		tooltip: t(`ProjectSheetManager.sheetTypes.${st.name}`),
	}));
});

function resetModal() {
	sourceMap.value = null;
	title.value = '';
	titleState.value = null;
	type.value = 'text';
}

function toggleSheetType(clickedType: string) {
	if (clickedType === type.value) {
		type.value = 'text';
	} else {
		type.value = clickedType;
	}
}

function handleOk(bvModalEvt: BvTriggerableEvent) {
	bvModalEvt.preventDefault(); // prevent modal close
	handleSubmit();
}

function checkFormValidity() {
	const valid = form.value?.checkValidity() || false;
	titleState.value = valid;
	return valid;
}

const { errorToast } = useToasts();

async function handleSubmit() {
	if (!checkFormValidity()) return;

	let initialFeatures = '[]';
	if (sourceMap.value) {
		const m = await $fetch<Map>(`/api/map/${sourceMap.value}`);
		initialFeatures = m.features;
	}

	const sheetData: Partial<Sheet> = {
		projectId: props.projectId,
		title: title.value,
	};

	switch (type.value) {
		case 'survey':
			sheetData.survey = '{}';
			break;

		case 'staticMap':
			sheetData.features = initialFeatures;
			sheetData.survey = '{}'; // staticMap has optional survey too
			break;

		case 'interactiveMap':
			sheetData.features = initialFeatures;
			sheetData.interactions = serializeInteractions(
				createInteractions({
					drawing: [createDrawingInteraction({})],
				}),
			);
			break;
	}

	try {
		const sheet = await $fetch<Sheet>(`/api/project/${props.projectId}/sheet`, {
			method: 'PUT',
			body: sheetData,
		});
		await nextTick();
		visible.value = false;
		emit('addedSheet', sheet);
		await nextTick();
		resetModal();
	} catch (error) {
		errorToast(t('projectEditor.sheetCreationFailed'));
	}
}
</script>

<template>
	<b-modal
		v-model="visible"
		:title="$t('ProjectSheetManager.title')"
		:cancel-title="$t('modals.cancel')"
		ok-variant="success"
		@show="resetModal"
		@shown="titleInput?.focus()"
		@hidden="resetModal"
		@ok="handleOk"
	>
		<form
			ref="form"
			@submit.stop.prevent="handleSubmit"
		>
			<b-form-group
				:label="$t('ProjectSheetManager.sheetName')"
				:invalid-feedback="$t('ProjectSheetManager.sheetNameRequired')"
				:state="titleState"
			>
				<b-form-input
					ref="titleInput"
					v-model="title"
					:state="titleState"
					required
				/>
			</b-form-group>

			<p class="pb-3">
				{{ $t('ProjectSheetManager.sheetType') }}
			</p>
			<div class="d-flex justify-content-between">
				<span
					v-for="st in sheetTypes"
					:key="st.name"
					v-b-tooltip.hover
					:title="st.tooltip"
					:class="type === st.name ? 'text-success border border-success' : 'text-muted'"
					class="btn btn-link"
					role="button"
					@click="toggleSheetType(st.name)"
				>
					<i
						:class="st.icon"
						class="fas fa-fw fa-2x"
					/>
				</span>
			</div>

			<b-form-group v-if="'staticMap;interactiveMap'.includes(type)">
				<label for="sourceMap">{{ $t('ProjectSheetManager.copyFeaturesFrom') }}</label>
				<b-form-select
					id="sourceMap"
					v-model="sourceMap"
					:options="mapOptions"
				/>
			</b-form-group>
		</form>
	</b-modal>
</template>
