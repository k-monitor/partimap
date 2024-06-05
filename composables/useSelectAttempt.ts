import type { Feature as GeoJsonFeature } from 'geojson';

export default function useSelectAttempt() {
	const bus = useEventBus<GeoJsonFeature | null>('selectAttempt');

	return {
		emitSelectAttempt: bus.emit,
		onSelectAttempt: bus.on,
	};
}
