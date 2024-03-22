export default function useStore() {
	const baseMap = useState<string>('baseMap', () => 'osm');
	const drawType = useState<'' | 'Point' | 'LineString' | 'Polygon'>('drawType', () => '');
	const sidebarVisible = useState('sidebarVisible', () => true);

	return {
		baseMap,
		drawType,
		sidebarVisible,
	};
}
