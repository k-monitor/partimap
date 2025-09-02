import type { Sheet } from '~/server/data/sheets';

export default (sheet: Ref<Sheet | undefined>) => {
	const sheetTimes = useState<Record<number, number>>('sheetTimes', () => ({}));
	const currentSheetId = useState<number>('currentSheetId', () => 0);
	const currentTimeStartedAt = useState<number>('currentTimeStartedAt', () => 0);

	function stopSheetTimer() {
		if (!currentSheetId.value || !currentTimeStartedAt.value) return;
		const elapsedTime = -currentTimeStartedAt.value + Date.now();
		if (elapsedTime <= 0) return;

		console.log('SHEET TIMER - sheet ID', currentSheetId.value, ' + elapsed time', elapsedTime);
		const previousElapsedTime = sheetTimes.value[currentSheetId.value] || 0;
		sheetTimes.value[currentSheetId.value] = previousElapsedTime + elapsedTime;
		currentSheetId.value = 0;
		currentTimeStartedAt.value = 0;
	}

	function startSheetTimer(sheetId: number) {
		stopSheetTimer();
		console.log('SHEET TIMER - sheet ID', sheetId, 'starting timer');
		currentSheetId.value = sheetId;
		currentTimeStartedAt.value = Date.now();
	}

	const isMounted = ref(false);

	onMounted(() => {
		isMounted.value = true;
	});

	const sheetId = computed(() => sheet.value?.id || 0);
	watch([isMounted, sheetId], () => {
		console.log('SHEET TIMER - watch effect', isMounted.value, sheetId.value);
		if (isMounted.value && sheetId.value) {
			startSheetTimer(sheetId.value);
		}
	});

	onBeforeUnmount(() => {
		stopSheetTimer();
	});

	return {
		stopSheetTimer,
		sheetTimes: readonly(sheetTimes),
	};
};
