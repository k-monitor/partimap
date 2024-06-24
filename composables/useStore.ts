export type DrawTypeWithOffState = '' | DrawType;

export default function useStore() {
	const baseMap = useState<string>('baseMap', () => 'osm');
	const baseMapToShow = computed(() =>
		baseMaps.find((bm) => bm.id === baseMap.value) ? baseMap.value : 'osm',
	);
	function changeBaseMap(key?: string) {
		if (key) return (baseMap.value = key);
		const keys = baseMaps.map((bm) => bm.id);
		const index = (keys.indexOf(baseMap.value) + 1) % keys.length;
		baseMap.value = keys[index];
	}

	const consent = useState<boolean>('consent', () => false);
	const currentZoom = useState<number>('currentZoom', () => 0);

	const currentDrawingInteraction = useState<DrawingInteraction | null>(
		'currentDrawingInteraction',
		() => null,
	);
	const drawType = useState<DrawTypeWithOffState>('drawType', () => '');
	function toggleVisitorDrawing(di: DrawingInteraction | null) {
		if (!di) {
			drawType.value = '';
			currentDrawingInteraction.value = null;
		} else {
			drawType.value = di.type;
			currentDrawingInteraction.value = di;
		}
	}

	const filteredFeatureIds = useState<number[] | null>('filteredFeatureIds', () => null);
	const loading = useState<boolean>('loading', () => true);
	const selectedFeatureId = useState<number | null>('selectedFeatureId', () => null);
	const sidebarVisible = useState('sidebarVisible', () => true);
	const submitted = useState('submitted', () => false);
	const visibleFeatureBubbles = useState<number[]>('visibleFeatureBubbles', () => []);

	onMounted(() => (loading.value = false));

	return {
		baseMapToShow,
		changeBaseMap,
		consent,
		currentDrawingInteraction,
		currentZoom,
		drawType,
		filteredFeatureIds,
		loading,
		selectedFeatureId,
		sidebarVisible,
		submitted,
		toggleVisitorDrawing,
		visibleFeatureBubbles,
	};
}
