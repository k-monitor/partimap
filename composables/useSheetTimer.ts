export default () => {
	const sheetTimes = useState<Record<number, number>>('sheetTimes', () => ({}));
	const currentSheetId = useState<number>('currentSheetId', () => 0);
	const currentTimeStartedAt = useState<number>('currentTimeStartedAt', () => 0);

	function clearSheetTimes() {
		console.log('SHEET TIMER - clearing');
		currentSheetId.value = 0;
		currentTimeStartedAt.value = 0;
		sheetTimes.value = {};
	}

	function stopSheetTimer() {
		if (currentSheetId.value && currentTimeStartedAt.value) {
			const elapsedTime = -currentTimeStartedAt.value + Date.now();
			console.log(
				'SHEET TIMER - sheet ID',
				currentSheetId.value,
				' + elapsed time',
				elapsedTime,
			);
			sheetTimes.value[currentSheetId.value] = elapsedTime;
		}
	}

	function startSheetTimer(sheetId: number) {
		stopSheetTimer();
		console.log('SHEET TIMER - sheet ID', sheetId, 'starting timer');
		currentSheetId.value = sheetId;
		currentTimeStartedAt.value = Date.now();
	}

	return {
		clearSheetTimes,
		startSheetTimer,
		stopSheetTimer,
		sheetTimes: readonly(sheetTimes),
	};
};
