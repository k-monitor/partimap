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

	const currentDrawingInteraction = useState<DrawingInteraction | null>(
		'currentDrawingInteraction',
		() => null,
	);
	const drawType = computed<DrawTypeWithOffState>({
		get() {
			return currentDrawingInteraction.value?.type || '';
		},
		set(dt: DrawTypeWithOffState) {
			currentDrawingInteraction.value = dt
				? createDrawingInteraction({ id: dt, type: dt })
				: null;
		},
	});

	const consent = useState<boolean>('consent', () => false);
	const currentZoom = useState<number>('currentZoom', () => 0);
	const filteredFeatureIds = useState<string[] | null>('filteredFeatureIds', () => null);
	const loading = useState<boolean>('loading', () => true);
	const loadingText = useState<string>('loadingText', () => '');
	const selectedFeatureId = useState<string | null>('selectedFeatureId', () => null);
	const sidebarVisible = useState('sidebarVisible', () => true);
	const submitted = useState('submitted', () => false);
	const visibleFeatureBubbles = useState<string[]>('visibleFeatureBubbles', () => []);

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
		loadingText,
		selectedFeatureId,
		sidebarVisible,
		submitted,
		visibleFeatureBubbles,
	};
}
