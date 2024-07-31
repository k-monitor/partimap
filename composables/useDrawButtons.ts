import type { DrawTypeWithOffState } from './useStore';

export type DrawingButton = {
	color: string;
	drawingInteraction: DrawingInteraction | null;
	icon: string;
	tooltip: string;
};

export function useDrawButtons(interactions: Interactions | null | undefined) {
	const { t } = useI18n();
	const { drawType } = useStore();
	const { getAllVisitorAnswers } = useVisitorData();

	function b(di: DrawingInteraction | null): DrawingButton {
		const dt: DrawTypeWithOffState = di?.type || '';
		return {
			color: di?.color || DEFAULT_COLORS[dt],
			drawingInteraction: di,
			icon: DRAW_TYPE_ICONS[dt],
			tooltip: dt
				? di?.buttonLabel || t(`sheetEditor.interactions.${dt}`)
				: t('modals.cancel'),
		};
	}

	const drawButtons = computed(() => {
		if (drawType.value) {
			// drawing in progress, show cancel button
			return [b(null)];
		}

		if (!interactions) {
			// admin toolbar shows draw type buttons
			return DRAW_TYPES.map((dt) => b(createDrawingInteraction({ type: dt })));
		}

		// visitor toolbar shows drawing interaction buttons
		return (interactions.drawing || [])
			.filter((di) => canShowQuestion(di, getAllVisitorAnswers.value))
			.map((di) => b(di));
	});

	return drawButtons;
}
