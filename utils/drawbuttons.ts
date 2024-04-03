//import { deserializeInteractions } from '../OLD/assets/interactions';

function db(drawType: DrawType, icon: string, tooltip: string, variant: string) {
	return { drawType, icon, tooltip, variant };
}

const _buttons = [
	db('Point', 'fa-map-marker-alt', 'Pont felrajzolása', 'danger'),
	db('LineString', 'fa-route', 'Vonal felrajzolása', 'blue'),
	db('Polygon', 'fa-draw-polygon', 'Terület felrajzolása', 'success'),
	db('', 'fa-times', 'Mégsem', 'warning'),
];

export function generateDrawButtons(
	currentDrawType: DrawType,
	interactions: any, // FIXME need type
	isVisitor: boolean,
	t: (key: string) => string,
) {
	return _buttons
		.filter((button) => {
			const { drawType } = button;
			const isDrawing = currentDrawType;
			const isCancel = !drawType;
			if ((isDrawing && !isCancel) || (!isDrawing && isCancel)) {
				// hide cancel if not in drawing mode
				// hide others if in drawing mode
				return false;
			}

			const isAllowed = isCancel || interactions?.enabled?.includes?.(drawType);
			if (isVisitor && !isAllowed) {
				// hide buttons for visitors unless
				// enabled in sheet interactions
				return false;
			}

			return true;
		})
		.map((button) => {
			if (button.drawType) {
				button.tooltip =
					interactions?.buttonLabels?.[button.drawType] ||
					t(`sheetEditor.interactions.${button.drawType}`);
			} else {
				button.tooltip = t('modals.cancel');
			}
			return button;
		});
}
