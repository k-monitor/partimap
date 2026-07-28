export default () => {
	const capturedParams = useState<CapturedParams>('capturedParams', () => ({}));

	return {
		capturedParams,
	};
};
