export default function useToasts() {
	const { show, remove } = useToast();

	function toast(message: string, variant: string) {
		const colorClasses =
			variant === 'danger'
				? 'bg-danger border-danger text-white'
				: 'bg-dark border-secondary text-white';

		const id = show?.({
			props: {
				interval: 2500, // not respected, workaround below
				noCloseButton: true,
				pos: 'bottom-center',
				solid: true,
				title: message,
				toastClass: `${colorClasses} border mb-5 rounded shadow-sm text-center`,
			},
		});
		if (id) window.setTimeout(() => remove?.(id), 2500); // ensure toast is removed
	}

	function errorToast(message: string) {
		toast(message, 'danger');
	}

	function successToast(message: string) {
		toast(message, 'success');
	}

	return {
		errorToast,
		successToast,
	};
}
