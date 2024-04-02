<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';

const { t } = useI18n();

const aggregatedRating = inject<Record<string, number>>('aggregatedRating', {}); // FIXME type
const feature = inject<GeoJsonFeature>('feature');
const interactions = inject<Record<string, any>>('interactions', {}); // FIXME Interactions type

defineProps<{
	isDeletable: boolean;
	isSelected: boolean;
	showResult: boolean;
}>();

defineEmits<{
	(e: 'click'): void;
	(e: 'delete'): void;
}>();

const icons: Record<string, string> = {
	Point: 'fa-map-marker-alt',
	LineString: 'fa-route',
	Polygon: 'fa-draw-polygon',
};

const isRated = computed(() => {
	const r = feature?.properties?.rating;
	return Number.isInteger(r) && r !== 0;
});

const nonEmptyName = computed(() => {
	const anon = t(`FeatureListElement.defaultName.${feature?.geometry?.type}`);
	return feature?.properties?.name || anon;
});

const ratingResult = computed(() => {
	const r = aggregatedRating;
	if (!r.count || !interactions) return;
	if (interactions.stars === -2) {
		return `👍 ${r.likeCount} 👎 ${Math.abs(r.dislikeCount)}`;
	} else if (interactions.stars === 1) {
		const count = r.count;
		return `⭐ ${count}`;
	} else {
		const avg = Math.round(r.average * 10) / 10;
		return `⭐ ${Number(avg).toFixed(1)}`;
	}
});
</script>

<template>
	<button
		class="list-group-item list-group-item-action align-items-center d-flex justify-content-between p-2 rounded"
		:style="{
			borderBottomLeftRadius: isSelected ? '0 !important' : 'inherit',
			borderBottomRightRadius: isSelected ? '0 !important' : 'inherit',
			borderLeftColor: feature?.properties?.color,
			borderLeftWidth: '5px',
			opacity: !isSelected && !showResult && isRated ? 0.6 : 1,
		}"
		@click="$emit('click')"
	>
		<span
			class="text-break"
			:class="{ 'fw-bold': isSelected }"
		>
			<i
				class="fas fa-fw me-1"
				:class="icons[feature?.geometry?.type || '']"
			/>
			<i
				v-if="feature?.properties?.hidden"
				class="fas fa-eye-slash fa-fw me-1"
			/>
			{{ nonEmptyName }}
		</span>

		<span v-if="isSelected">
			<i class="fas fa-fw fa-times" />
		</span>
		<template v-else>
			<span
				v-if="isDeletable"
				class="ms-auto text-danger"
				role="button"
				@click.stop="$emit('delete')"
			>
				<i class="fas fa-fw fa-trash" />
			</span>

			<span
				v-if="showResult && ratingResult"
				class="flex-shrink-0"
			>
				{{ ratingResult }}
			</span>
			<span v-else-if="isRated">
				<i class="fas fa-fw fa-check" />
			</span>
		</template>
	</button>
</template>
