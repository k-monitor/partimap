export default function useStore() {
	const baseMap = useState<string>('baseMap', () => 'osm');
	const baseMapToShow = computed(() =>
		baseMaps.find((bm) => bm.id === baseMap.value) ? baseMap.value : 'osm',
	);
	function changeBaseMap() {
		const keys = baseMaps.map((bm) => bm.id);
		const index = (keys.indexOf(baseMap.value) + 1) % keys.length;
		baseMap.value = keys[index];
	}

	const drawType = useState<'' | 'Point' | 'LineString' | 'Polygon'>('drawType', () => '');
	const sidebarVisible = useState('sidebarVisible', () => true);

	return {
		baseMapToShow,
		changeBaseMap,
		drawType,
		sidebarVisible,
	};
}
