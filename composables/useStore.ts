export default function useStore() {
	const drawType = useState<'' | 'Point' | 'LineString' | 'Polygon'>('drawType', () => '');
	const sidebarVisible = useState('sidebarVisible', () => true);

	return {
		drawType,
		sidebarVisible,
	};
}
