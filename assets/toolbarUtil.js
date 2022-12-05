import { deserializeInteractions } from './interactions';

function db(drawType, icon, tooltip, variant) {
	return { drawType, icon, tooltip, variant };
}

const _buttons = [
	db('Point', 'fa-map-marker-alt', 'Pont felrajzolása', 'danger'),
	db('LineString', 'fa-route', 'Vonal felrajzolása', 'primary'),
	db('Polygon', 'fa-draw-polygon', 'Terület felrajzolása', 'success'),
	db('', 'fa-times', 'Mégsem', 'warning'),
];

export function buttons(currentDrawType, sheetInteractions, isVisitor) {
	const interactions = deserializeInteractions(sheetInteractions);
	return _buttons
		.filter(button => {
			const { drawType } = button;
			const isDrawing = currentDrawType;
			const isCancel = !drawType;
			if ((isDrawing && !isCancel) || (!isDrawing && isCancel)) {
			// hide cancel if not in drawing mode
			// hide others if in drawing mode
				return false;
			}

			const isAllowed = isCancel || interactions.enabled.includes(drawType);
			if (isVisitor && !isAllowed) {
			// hide buttons for visitors unless
			// enabled in sheet interactions
				return false;
			}

			return true;
		})
		.map(button => {
			button.tooltip = interactions.buttonLabels[button.drawType] || button.tooltip;
			return button;
		});
}
