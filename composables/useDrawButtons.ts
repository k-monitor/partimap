import type { DrawTypeWithOffState } from './useStore';

const DRAW_BUTTON_VARIANTS: Record<DrawTypeWithOffState, string> = {
	'': 'warning',
	Point: 'danger',
	LineString: 'blue', // because primary can be overriden by brand color
	Polygon: 'success',
};

export function useDrawButtons(visitor: boolean, interactions: Interactions | null | undefined) {
	const { t } = useI18n();
	const { drawType } = useStore();

	function b(dt: DrawTypeWithOffState, di: DrawingInteraction | null) {
		return {
			drawingInteraction: di,
			drawType: dt,
			icon: DRAW_TYPE_ICONS[dt],
			tooltip: dt
				? di?.buttonLabel || t(`sheetEditor.interactions.${dt}`)
				: t('modals.cancel'),
			variant: DRAW_BUTTON_VARIANTS[dt],
		};
	}

	const drawButtons = computed(() => {
		if (drawType.value) {
			// drawing in progress, show cancel button
			return [b('', null)];
		}

		if (!visitor) {
			// admin toolbar shows draw type buttons
			return DRAW_TYPES.map((dt) => b(dt, null));
		}

		// visitor toolbar shows drawing interaction buttons
		return (interactions?.drawing || []).map((di) => b(di.type, di));
	});

	return drawButtons;
}
