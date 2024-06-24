<script setup lang="ts">
import type { Sheet } from '~/server/data/sheets';

const { t } = useI18n();

const sheet = inject<Ref<Sheet | null>>('sheet', ref(null));
const interactions = defineModel<Interactions>({
	default: deserializeInteractions(undefined),
});

const interactionOptions = computed(() => {
	if (!sheet.value) return [];

	const ia = (interactionName: OnOffInteraction) => ({
		value: interactionName,
		text: t(`sheetEditor.interactions.${interactionName}`),
	});

	if (sheet.value.features && sheet.value.survey) {
		// static map sheet
		return [ia('Rating')];
	}

	if (!sheet.value.features) {
		// text or survey sheet
		return [ia('SocialSharing')];
	}
});

// on/off

function toggleInteraction(ia: OnOffInteraction, enabled: boolean) {
	if (enabled) {
		if (!interactions.value.enabled.includes(ia)) {
			interactions.value.enabled.push(ia);
		}
	} else {
		interactions.value.enabled = interactions.value.enabled.filter((i) => i !== ia);
	}
}

const settingsModals: Record<string, Ref<boolean>> = {
	DrawingInteraction: ref(false),
	Rating: ref(false),
};

function hasSettings(ia: OnOffInteraction) {
	return Object.keys(settingsModals).includes(ia); // only 'Rating' at the moment
}

function openInteractionSettings(ia: OnOffInteraction) {
	if (hasSettings(ia) && interactions.value.enabled.includes(ia)) {
		settingsModals[ia].value = true;
	}
}

const editedDrawingInteractionIndex = ref<number>(-1);

function openDrawingInteractionSettings(index: number) {
	editedDrawingInteractionIndex.value = index;
	settingsModals.DrawingInteraction.value = true;
}

// edit

function handleRatingInteractionModified(
	ratingExplanation: boolean,
	ratingProsCons: boolean,
	ratingQuestion: string,
	ratingResults: boolean,
	stars: number,
) {
	interactions.value.ratingQuestion = ratingQuestion;
	interactions.value.stars = stars;
	toggleInteraction('RatingExplanation', ratingExplanation);
	toggleInteraction('RatingProsCons', ratingProsCons);
	toggleInteraction('RatingResults', ratingResults);
}

function handleDrawingInteractionModified(di: DrawingInteraction) {
	const dis = interactions.value.drawing;
	dis[editedDrawingInteractionIndex.value] = di;
	interactions.value.drawing = dis;
	editedDrawingInteractionIndex.value = -1;
}

function addDrawingInteraction() {
	const dis = interactions.value.drawing;
	dis.push(createDrawingInteraction({}));
	editedDrawingInteractionIndex.value = dis.length - 1;
	settingsModals.DrawingInteraction.value = true;
}

const { confirmDeletion } = useConfirmation();

async function removeDrawingInteraction(index: number) {
	const dis = interactions.value.drawing;
	if (dis.length <= 1) return;
	const c = await confirmDeletion(
		dis[index].featureLabel || t(`sheetEditor.interactions.${dis[index].type}`),
	);
	if (!c) return;
	dis.splice(index, 1);
}
</script>

<template>
	<form-group :label="$t('sheetEditor.visitorInteractions')">
		<b-list-group class="mb-3">
			<b-list-group-item
				v-for="o in interactionOptions"
				:key="o.value"
				class="d-flex p-0 align-items-center"
			>
				<div class="px-3 py-2">
					<div class="form-check">
						<input
							:id="o.value"
							v-model="interactions.enabled"
							class="form-check-input"
							type="checkbox"
							:value="o.value"
							@change="openInteractionSettings(o.value)"
						/>
						<label
							class="form-check-label"
							:for="o.value"
						>
							{{ o.text }}
						</label>
					</div>
				</div>
				<b-button
					v-if="hasSettings(o.value)"
					class="border-0 ms-auto px-2 py-2 rounded-0"
					variant="outline-primary"
					:disabled="!interactions.enabled.includes(o.value)"
					@click="openInteractionSettings(o.value)"
				>
					<i class="fas fa-fw fa-cog" />
				</b-button>
			</b-list-group-item>
			<b-list-group-item
				v-for="(di, i) in interactions.drawing"
				:key="di.id"
				button
				class="d-flex p-0 align-items-center"
				@click="openDrawingInteractionSettings(i)"
			>
				<div class="p-2 text-truncate">
					<!-- TODO wire in di.color -->
					<i
						class="fas fa-fw mx-1"
						:class="DRAW_TYPE_ICONS[di.type]"
					/>
					{{ di.featureLabel || $t(`sheetEditor.interactions.${di.type}`) }}
				</div>
				<b-button
					v-if="interactions.drawing.length > 1"
					class="border-0 ms-auto px-2 py-2 rounded-0"
					variant="outline-danger"
					@click.stop="removeDrawingInteraction(i)"
				>
					<i class="fas fa-fw fa-trash" />
				</b-button>
			</b-list-group-item>
			<b-list-group-item
				v-if="interactions.drawing.length"
				button
				class="d-flex align-items-center text-success"
				@click="addDrawingInteraction"
			>
				<i class="fas fa-fw fa-plus me-2" />
				{{ $t('sheetEditor.addDrawingInteraction') }}
			</b-list-group-item>
		</b-list-group>
	</form-group>
	<InteractionSettingsModal
		v-if="interactions.drawing[editedDrawingInteractionIndex]"
		:key="editedDrawingInteractionIndex"
		v-model="settingsModals.DrawingInteraction.value"
		:drawing-interaction="
			JSON.parse(JSON.stringify(interactions.drawing[editedDrawingInteractionIndex]))
		"
		@modified="handleDrawingInteractionModified"
	/>
	<RatingSettingsModal
		v-model="settingsModals.Rating.value"
		:interactions="interactions"
		@modified="handleRatingInteractionModified"
	/>
</template>
