export default function useToasts() {
	const { show } = useToast();

	function toast(message: string, variant: string) {
		const colorClasses =
			variant === 'danger'
				? 'bg-danger border-danger text-white'
				: 'bg-dark border-secondary text-white';

		show?.({
			props: {
				interval: 2500,
				noCloseButton: true,
				pos: 'bottom-center',
				solid: true,
				title: message,
				toastClass: `${colorClasses} border mb-5 rounded shadow-sm text-center`,
			},
		});
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
