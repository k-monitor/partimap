export const buttons = [
	db('Point', 'fa-map-marker-alt', 'Pont', 'danger'),
	db('LineString', 'fa-route', 'Vonal', 'primary'),
	db('Polygon', 'fa-draw-polygon', 'Terület', 'success'),
	db('', 'fa-times', 'Mégsem', 'warning'),
];

function db(drawType, icon, tooltip, variant) {
	return { drawType, icon, tooltip, variant };
}

export function buttonFilter(currentDrawType, interactions, isVisitor) {
	return button => {
		const { drawType } = button;
		const isDrawing = currentDrawType;
		const isCancel = !drawType;
		if ((isDrawing && !isCancel) || (!isDrawing && isCancel)) {
			// hide cancel if not in drawing mode
			// hide others if in drawing mode
			return false;
		}

		const isAllowed = isCancel || parseInteractions(interactions).includes(drawType);
		if (isVisitor && !isAllowed) {
			// hide buttons for visitors unless
			// enabled in sheet interactions
			return false;
		}

		return true;
	};
}

function parseInteractions(interactions) {
	console.log('parseInteractions', interactions);
	return JSON.parse(interactions || '[]');
}
